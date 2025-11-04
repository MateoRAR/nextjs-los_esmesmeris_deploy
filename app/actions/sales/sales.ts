'use server';

import { decryptSession, getToken } from '@/app/lib/auth/session'; 
import { CreateSaleFormSchema } from '@/app/lib/sales/definitions';
import { revalidatePath } from 'next/cache';

export async function getSales() {
  const token = await getToken();
  if (!token) {
    throw new Error('No autenticado');
  }

  try {
    const response = await fetch(process.env.BACK_URL + '/sales', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(errorBody.message || 'Falló al obtener las ventas');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getSales:', error);
    return [];
  }
}

export async function createSale(data: { customerId: string; totalAmount: string | number }) {
  const token = await getToken();
  const session = await decryptSession(); 
  
  const employeeId = session?.id || session?.sub; 

  if (!token || !employeeId) {
    return { message: 'No autenticado. No se pudo crear la venta.', success: false };
  }

  const validatedFields = CreateSaleFormSchema.safeParse(data);

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos inválidos. No se pudo crear la venta.',
      success: false,
    };
  }

  const saleData = {
    customerId: validatedFields.data.customerId,
    employeeId: employeeId,
    totalAmount: validatedFields.data.totalAmount,
    items: [],
    status: 'pending',
  };

  try {
    const response = await fetch(process.env.BACK_URL + '/sales', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(saleData),
    });

    const body = await response.json();

    if (!response.ok) {
      const errorMessage = Array.isArray(body.message) 
        ? body.message.join(', ') 
        : (body.message || 'Error del servidor al crear la venta.');
      
      return {
        message: errorMessage,
        success: false,
      };
    }

    revalidatePath('/sales');
    
    return { 
      message: 'Venta creada exitosamente.', 
      success: true,
      data: body 
    };

  } catch (error) {
    console.error('Error en createSale:', error);
    return { message: 'Error de red. No se pudo crear la venta.', success: false };
  }
}

