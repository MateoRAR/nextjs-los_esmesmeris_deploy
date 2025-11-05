import { NextRequest, NextResponse } from 'next/server';
import { getToken } from '@/app/lib/auth/session';
import { apiFetch } from '@/app/lib/api';

export async function GET(request: NextRequest) {
  try {
    const token = await getToken();
    if (!token) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const orders = await apiFetch<any[]>('/orders');
    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('Error en polling de órdenes:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener órdenes' },
      { status: 500 }
    );
  }
}

