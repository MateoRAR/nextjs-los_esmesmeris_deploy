
import 'server-only'

import { SignJWT, jwtVerify } from 'jose';
import { SessionPayload } from '@/app/lib/login/definitions';
import { cookies } from 'next/headers';

export async function createSession(token: any) {
  //Expires in 7 days (we add a number in ml)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = token;
  const cookieStore = await cookies()

  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })

}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

export async function decryptSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value
  if (!token) return null

  try {
    const payloadBase64 = token.split('.')[1]
    const decodedPayload = JSON.parse(atob(payloadBase64))
    return decodedPayload
  } catch {
    return null
  }
}

