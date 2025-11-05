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

export async function createSale(data: { 
  customerId: string; 
  totalAmount: string | number;
  status?: string;
  items?: Array<{ productId: string; quantity: number; unitPrice: number }>;
}) {
  const token = await getToken();
  const session = await decryptSession(); 
  
  const employeeId = session?.user_id || session?.id || session?.sub || session?.userId; 

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
    items: data.items || [],
    status: data.status || 'pending', // Usar el estado proporcionado o 'pending' por defecto
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

export async function getSaleById(saleId: string) {
  const token = await getToken();
  if (!token) {
    return { success: false, message: 'No autenticado', data: null };
  }

  try {
    const response = await fetch(`${process.env.BACK_URL}/sales/${saleId}`, {
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
        message: errorBody.message || 'Error al obtener la venta',
        data: null,
      };
    }

    const sale = await response.json();
    return { success: true, message: 'Venta obtenida', data: sale };
  } catch (error) {
    console.error('Error en getSaleById:', error);
    return { success: false, message: 'Error de red al obtener la venta', data: null };
  }
}

export async function cancelSale(saleId: string) {
  const token = await getToken();
  if (!token) {
    return { success: false, message: 'No autenticado' };
  }

  try {
    const response = await fetch(`${process.env.BACK_URL}/sales/${saleId}/cancel`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorBody = await response.json();
      return {
        success: false,
        message: errorBody.message || 'Error al cancelar la venta',
      };
    }

    const result = await response.json();
    revalidatePath('/sales');
    revalidatePath(`/sales/${saleId}`);
    
    return { 
      success: true, 
      message: 'Venta cancelada exitosamente',
      data: result 
    };
  } catch (error) {
    console.error('Error en cancelSale:', error);
    return { success: false, message: 'Error de red al cancelar la venta' };
  }
}

export async function updateSaleStatus(saleId: string, status: string) {
  const token = await getToken();
  if (!token) {
    return { success: false, message: 'No autenticado' };
  }

  try {
    // Si el estado es 'cancelled', usar el endpoint específico de cancelar
    if (status === 'cancelled') {
      return await cancelSale(saleId);
    }

    // Si necesitas un endpoint general para actualizar estado, agrégalo aquí
    // Por ahora, solo soportamos cancelar
    return {
      success: false,
      message: 'Solo se puede cambiar el estado a cancelado. Para otros estados, contacta al administrador.',
    };
  } catch (error) {
    console.error('Error en updateSaleStatus:', error);
    return { success: false, message: 'Error al actualizar el estado de la venta' };
  }
}
