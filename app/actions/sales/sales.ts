'use server';

import { decryptSession, getToken } from '@/app/lib/auth/session'; 
import { CreateSaleFormSchema, CreateSaleFormState } from '@/app/lib/sales/definitions';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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

export async function createSale(
  prevState: CreateSaleFormState,
  formData: FormData,
): Promise<CreateSaleFormState> {
  const token = await getToken();
  const session = await decryptSession(); 
  
  const employeeId = session?.id || session?.sub; 

  if (!token || !employeeId) {
    return { message: 'No autenticado. No se pudo crear la venta.', success: false };
  }

  const validatedFields = CreateSaleFormSchema.safeParse({
    customerId: formData.get('customerId'),
    totalAmount: formData.get('totalAmount'),
  });

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos inválidos. No se pudo crear la venta.',
      success: false,
    };
  }

  const saleData = {
    ...validatedFields.data,
    employeeId: employeeId,
    items: [],
    status: 'pending',
  };

  try {
    // MODIFICADO: Se quitó /api/ de la ruta
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
      return {
        message: body.message || 'Error del servidor al crear la venta.',
        success: false,
      };
    }
  } catch (error) {
    console.error(error);
    return { message: 'Error de red. No se pudo crear la venta.', success: false };
  }

  revalidatePath('/sales');
  redirect('/sales');

  // Esta parte no se ejecutará debido al redirect, pero es buena práctica
  // return { message: 'Venta creada exitosamente.', success: true };
}

