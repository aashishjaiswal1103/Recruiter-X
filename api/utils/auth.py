from fastapi import Request, HTTPException, Depends
from jose import jwt, JWTError
from config import settings
from services.supabase_client import get_supabase_client

async def authenticate_jwt(request: Request) -> str:
    """
    FastAPI dependency to extract and validate the Supabase JWT token from the Authorization header.
    Injects the verified user_id into request.state.user_id.
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail={"code": "MISSING_BEARER_TOKEN", "message": "Authorization header must be Bearer token."}
        )
        
    token = auth_header.split(" ")[1]
    
    # Dev bypass mode if SUPABASE_JWT_SECRET is placeholder
    if settings.SUPABASE_JWT_SECRET in ["", "your_supabase_jwt_secret", "MISSING"]:
        # If secret is not yet configured, allow a dummy validation for local development
        # We can extract the user_id from the token without verification if in dev/bypass mode
        try:
            payload = jwt.get_unverified_claims(token)
            user_id = payload.get("sub") or "00000000-0000-0000-0000-000000000000"
            request.state.user_id = user_id
            return user_id
        except Exception:
            user_id = "00000000-0000-0000-0000-000000000000"
            request.state.user_id = user_id
            return user_id

    try:
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated"
        )
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=401,
                detail={"code": "INVALID_TOKEN_SUB", "message": "Token payload missing 'sub' claim."}
            )
        request.state.user_id = user_id
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail={"code": "TOKEN_EXPIRED", "message": "The provided authentication token has expired."}
        )
    except JWTError as e:
        raise HTTPException(
            status_code=401,
            detail={"code": "INVALID_TOKEN", "message": f"Token validation failed: {str(e)}"}
        )

async def get_current_user(user_id: str = Depends(authenticate_jwt)) -> str:
    """
    Helper dependency that simply yields the authenticated user's ID.
    """
    return user_id

class RequireRole:
    """
    FastAPI dependency factory to enforce organization membership and role permissions.
    Injects request.state.org_id and request.state.role.
    """
    def __init__(self, allowed_roles: list[str]):
        self.allowed_roles = allowed_roles

    async def __call__(self, request: Request, user_id: str = Depends(authenticate_jwt)) -> str:
        # Dev bypass mode if Supabase configurations are missing
        if settings.SUPABASE_URL in ["", "your_supabase_project_url"] or settings.SUPABASE_SERVICE_KEY in ["", "your_supabase_service_role_key"]:
            request.state.org_id = "00000000-0000-0000-0000-000000000000"
            request.state.role = "owner"
            return request.state.org_id

        try:
            supabase = get_supabase_client()
            response = supabase.table("org_members") \
                .select("org_id, role") \
                .eq("user_id", user_id) \
                .execute()
                
            if not response.data or len(response.data) == 0:
                raise HTTPException(
                    status_code=403,
                    detail={"code": "NO_ORGANISATION_MEMBERSHIP", "message": "User is not a member of any organization."}
                )
                
            member_record = response.data[0]
            org_id = member_record["org_id"]
            role = member_record["role"]
            
            request.state.org_id = org_id
            request.state.role = role
            
            if role not in self.allowed_roles:
                raise HTTPException(
                    status_code=403,
                    detail={
                        "code": "INSUFFICIENT_PERMISSIONS", 
                        "message": f"Action requires one of the following roles: {self.allowed_roles}. Current role: {role}"
                    }
                )
            
            return org_id
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail={"code": "AUTH_INTERNAL_ERROR", "message": f"Failed to check organization status: {str(e)}"}
            )
