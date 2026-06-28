import { createClient } from './supabase/client'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'

interface RequestOptions extends RequestInit {
  params?: Record<string, string>
}

async function request(path: string, options: RequestOptions = {}) {
  const headers = new Headers(options.headers)

  // Retrieve token from client-side Supabase session
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      headers.set('Authorization', `Bearer ${session.access_token}`)
    }
  } catch (error) {
    console.warn('Could not retrieve auth token for backend API call:', error)
  }

  // Set default JSON headers if not uploading files/FormData
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  // Format query parameters if any
  let url = `${API_BASE_URL}${path}`
  if (options.params) {
    const searchParams = new URLSearchParams(options.params)
    url += `?${searchParams.toString()}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    throw new Error(errData.detail?.message || errData.detail || `API Request failed with status ${response.status}`)
  }

  return response.json()
}

export const api = {
  get: (path: string, options?: RequestOptions) => request(path, { ...options, method: 'GET' }),
  post: (path: string, body?: any, options?: RequestOptions) => request(path, { ...options, method: 'POST', body: JSON.stringify(body) }),
  postFormData: (path: string, formData: FormData, options?: RequestOptions) => request(path, { ...options, method: 'POST', body: formData }),
  put: (path: string, body?: any, options?: RequestOptions) => request(path, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  patch: (path: string, body?: any, options?: RequestOptions) => request(path, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path: string, options?: RequestOptions) => request(path, { ...options, method: 'DELETE' }),
}
