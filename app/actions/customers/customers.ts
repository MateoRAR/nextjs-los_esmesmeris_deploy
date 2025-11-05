'use server';

import { getToken } from '@/app/lib/auth/session';
import { CreateCustomerFormSchema, CreateCustomerFormState } from '@/app/lib/customers/definition';
import { revalidatePath } from 'next/cache';

export async function getCustomers() {
  const token = await getToken();
  if (!token) {
    throw new Error('No autenticado');
  }

  try {
    const response = await fetch(process.env.BACK_URL + '/customers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(errorBody.message || 'Falló al obtener los clientes');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getCustomers:', error);
    return [];
  }
}

export async function getCustomerByCardId(cardId: string) {
  const token = await getToken();
  if (!token) {
    return { success: false, message: 'No autenticado.' };
  }
  if (!cardId) {
    return { success: false, message: 'La cédula es requerida.' };
  }

  try {
    const response = await fetch(
      `${process.env.BACK_URL}/customers/card/${cardId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Cliente no encontrado.' };
    }

    return { success: true, data: data };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Error de red al buscar cliente.' };
  }
}

export async function createCustomer(
  prevState: CreateCustomerFormState,
  formData: FormData,
): Promise<CreateCustomerFormState> {
  const token = await getToken();
  if (!token) {
    return { message: 'No autenticado. No se pudo crear el cliente.', success: false };
  }

  const validatedFields = CreateCustomerFormSchema.safeParse({
    name: formData.get('name'),
    cardId: formData.get('cardId'),
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos inválidos. No se pudo crear el cliente.',
      success: false,
    };
  }
  
  const customerData = validatedFields.data;

  try {
    const response = await fetch(process.env.BACK_URL + '/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(customerData),
    });

    const body = await response.json();

    if (!response.ok) {
      const errorMessage = Array.isArray(body.message) ? body.message.join(', ') : (body.message || 'Error del servidor al crear el cliente.');
      return {
        message: errorMessage,
        success: false,
      };
    }
    
    revalidatePath('/customers');
    return { success: true, message: 'Cliente creado.', data: body }; 

  } catch (error) {
    console.error(error);
    return { message: 'Error de red. No se pudo crear el cliente.', success: false };
  }
}

export async function searchCustomersByName(name: string) {
  const token = await getToken();
  if (!token) {
    return { success: false, message: 'No autenticado', data: null };
  }

  try {
    // Buscar clientes por nombre usando query parameter
    const url = name.trim()
      ? `${process.env.BACK_URL}/customers?name=${encodeURIComponent(name)}`
      : `${process.env.BACK_URL}/customers`;

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
        message: errorBody.message || 'Error al buscar clientes',
        data: null,
      };
    }

    const customers = await response.json();
    return { success: true, message: 'Clientes encontrados', data: customers };
  } catch (error) {
    console.error('Error en searchCustomersByName:', error);
    return { success: false, message: 'Error de red al buscar clientes', data: null };
  }
}

