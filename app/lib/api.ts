import { getToken } from '@/app/lib/auth/session';
const API_URL = process.env.NEXT_PUBLIC_BACK_URL || process.env.BACK_URL || "http://localhost:3001";

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${await getToken()}`
    },
    cache: "no-store",
    ...options,
  });

  if (!res.ok) {
    throw new Error(`Error: ${res.status}, ${await res.text()}`);
  }

  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return null as unknown as T;
  }

  return res.json();
}
