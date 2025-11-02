'use server'
import { decryptSession, getToken } from '@/app/lib/auth/session';
import { cookies } from 'next/headers'

export async function getUsers() {
    const ans = await fetch(process.env.BACK_URL + '/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await getToken()}`
        },

    })
    const json = ans.json();

    return json;

}