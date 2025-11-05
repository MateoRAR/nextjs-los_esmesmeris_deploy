'use server';

import { getToken } from '@/app/lib/auth/session';

export async function getProducts() {
  const token = await getToken();
  if (!token) {
    throw new Error('No autenticado');
  }

  try {
    const response = await fetch(process.env.BACK_URL + '/products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(errorBody.message || 'Falló al obtener los productos');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getProducts:', error);
    return [];
  }
}

export async function searchProductsByName(name: string) {
  const token = await getToken();
  if (!token) {
    return { success: false, message: 'No autenticado', data: null };
  }

  try {
    // Si no hay nombre, obtener todos los productos
    const url = name.trim() 
      ? `${process.env.BACK_URL}/products?name=${encodeURIComponent(name)}`
      : `${process.env.BACK_URL}/products`;
      
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorBody = await response.json();
      return {
        success: false,
        message: errorBody.message || 'Error al buscar productos',
        data: null,
      };
    }

    const products = await response.json();
    return { success: true, message: 'Productos encontrados', data: products };
  } catch (error) {
    console.error('Error en searchProductsByName:', error);
    return { success: false, message: 'Error de red al buscar productos', data: null };
  }
}
