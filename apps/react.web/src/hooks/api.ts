export function getApiBaseUrl(): string {
  const viteUrl = import.meta.env.VITE_API_URL as string | undefined
  if (import.meta.env.DEV) {
    return viteUrl && viteUrl.includes('localhost') ? viteUrl : 'http://localhost:8787'
  }
  if (viteUrl) return viteUrl.replace(/\/$/, '')
  if (typeof window !== 'undefined') return window.location.origin
  return ''
}

export function apiUrl(path: string): string {
  const base = getApiBaseUrl().replace(/\/$/, '')
  const suffix = path.startsWith('/') ? path : `/${path}`
  return `${base}${suffix}`
}

type ApiOptions = RequestInit & { params?: Record<string, string | number | boolean | undefined> }

export async function apiFetch<T>(path: string, opts: ApiOptions = {}): Promise<T> {
  const { params, headers, ...init } = opts
  let url = apiUrl(path)
  if (params) {
    const qs = new URLSearchParams()
    for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== '') qs.set(k, String(v))
    const q = qs.toString()
    if (q) url += `?${q}`
  }
  const isForm = init.body instanceof FormData
  const res = await fetch(url, {
    credentials: 'include',
    headers: isForm ? (headers as Record<string, string>) : { 'Content-Type': 'application/json', ...(headers as Record<string, string>) },
    ...init,
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error((body as any).message ?? `Request failed ${res.status}`)
  return body as T
}
