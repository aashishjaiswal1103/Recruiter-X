# 13. Security, Logging & Auditing

This document details the mandatory security controls, log masking filters, and administrative audit trails required for compliance.

---

## 1. Sensitive Data Masking Middleware (`middleware/logging.py`)

To prevent third-party API credentials from leaking into log files, run a regex filter middleware on the standard output log stream.

### Masking Rules
*   **Regex Pattern:** Detect standard patterns for OpenAI, Anthropic, and Google API keys.
    *   OpenAI: `sk-[a-zA-Z0-9]{48}`
    *   Anthropic: `sk-ant-[a-zA-Z0-9_-]{95,150}`
    *   Gemini: `AIzaSy[a-zA-Z0-9_-]{33}`
*   **Replacement String:** `[MASKED_API_KEY]`

### Code Blueprint
```python
# utils/masking.py
import re

KEY_PATTERNS = [
    r"sk-[a-zA-Z0-9]{48}",
    r"sk-ant-[a-zA-Z0-9_\-]{95,150}",
    r"AIzaSy[a-zA-Z0-9_\-]{33}"
]

def mask_sensitive_strings(log_message: str) -> str:
    masked = log_message
    for pattern in KEY_PATTERNS:
        masked = re.sub(pattern, "[MASKED_API_KEY]", masked)
    return masked
```

Configure your Python logger to pass all messages through this filter prior to disk write or stdout dump.

---

## 2. Multi-Tenant Database Query Isolation

Even though Row Level Security (RLS) is enabled in the database, the backend uses a service client (which bypasses RLS). 

> [!CAUTION]
> You must **never** query any database table without explicitly appending the `org_id` filter to the query builder.

```python
# Bad query (Vulnerable to cross-tenant leak if RLS is bypassed)
data = supabase.table("candidates").select("*").eq("id", candidate_id).execute()

# Correct query (Explicitly tenant-bound)
data = supabase.table("candidates") \
    .select("*") \
    .eq("id", candidate_id) \
    .eq("org_id", org_id) \
    .execute()
```

---

## 3. Administrative Audit Logs

Every security-sensitive resource change or user action must write an entry to the `audit_logs` table.

| Event Action | Trigger Context | Metadata Fields |
| :--- | :--- | :--- |
| **`key_added`** | User registers an API key. | `{"provider": "gemini", "api_key_id": "..."}` |
| **`key_deleted`**| User deletes an API key. | `{"provider": "gemini", "api_key_id": "..."}` |
| **`project_created`**| User creates a project. | `{"project_id": "...", "title": "..."}` |
| **`analysis_started`**| Queue analysis batch starts. | `{"project_id": "...", "candidates_count": 12}` |
| **`export_downloaded`**| User requests CSV download. | `{"project_id": "..."}` |
| **`candidate_deleted`**| User deletes a candidate. | `{"candidate_id": "...", "project_id": "..."}` |

---

## 4. File Storage Security

1.  **Bucket Access:** The Supabase Storage bucket `resumes` must be marked as **Private**. Direct public URL requests must yield `403 Access Denied`.
2.  **Access Expiry:** Clients must query files via signed URLs with a **1-hour expiration** duration limit.
    ```python
    # Generating signed URL in services/storage.py
    signed_url = supabase.storage \
        .from_("resumes") \
        .create_signed_url(filepath, expires_in=3600)
    ```
3.  **Strict Isolation:** Resume storage keys must be pathed using organization and project scopes:
    `resumes/{org_id}/{project_id}/{candidate_id}/original.{ext}`
