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
    const json = await ans.json();
    //form json to array
    return json;
}

export async function searchUsersByName(name: string) {
    const token = await getToken();
    if (!token) {
        return { success: false, message: 'No autenticado', data: null };
    }

    try {
        // Buscar usuarios por nombre usando query parameter
        const url = name.trim()
            ? `${process.env.BACK_URL}/users?name=${encodeURIComponent(name)}`
            : `${process.env.BACK_URL}/users`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            const errorBody = await response.json();
            return {
                success: false,
                message: errorBody.message || 'Error al buscar usuarios',
                data: null,
            };
        }

        const users = await response.json();
        return { success: true, message: 'Usuarios encontrados', data: users };
    } catch (error) {
        console.error('Error en searchUsersByName:', error);
        return { success: false, message: 'Error de red al buscar usuarios', data: null };
    }
}
