'use server';

import { getToken } from '@/app/lib/auth/session';

// Obtener estadísticas generales del dashboard
export async function getDashboardStats() {
  const token = await getToken();
  if (!token) {
    return { success: false, message: 'No autenticado', data: null };
  }

  try {
    const [salesRes, customersRes, productsRes, usersRes] = await Promise.all([
      fetch(`${process.env.BACK_URL}/sales`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }),
      fetch(`${process.env.BACK_URL}/customers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }),
      fetch(`${process.env.BACK_URL}/products`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }),
      fetch(`${process.env.BACK_URL}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
    ]);

    const [sales, customers, products, users] = await Promise.all([
      salesRes.json(),
      customersRes.json(),
      productsRes.json(),
      usersRes.json()
    ]);

    // Calcular métricas
    const totalSales = Array.isArray(sales) ? sales.length : 0;
    const totalRevenue = Array.isArray(sales) 
      ? sales.reduce((sum, sale) => sum + (parseFloat(sale.totalAmount) || 0), 0)
      : 0;
    
    const totalCustomers = Array.isArray(customers) ? customers.length : 0;
    const totalProducts = Array.isArray(products) ? products.length : 0;
    const totalUsers = Array.isArray(users) ? users.length : 0;

    // Ventas completadas vs pendientes
    const completedSales = Array.isArray(sales) 
      ? sales.filter(s => s.status === 'completed').length 
      : 0;
    const pendingSales = Array.isArray(sales) 
      ? sales.filter(s => s.status === 'pending').length 
      : 0;

    // Productos con stock bajo (menos de 10)
    const lowStockProducts = Array.isArray(products)
      ? products.filter(p => p.stock < 10).length
      : 0;

    return {
      success: true,
      data: {
        totalSales,
        totalRevenue,
        totalCustomers,
        totalProducts,
        totalUsers,
        completedSales,
        pendingSales,
        lowStockProducts,
        sales: sales || [],
        products: products || [],
        customers: customers || []
      }
    };
  } catch (error) {
    console.error('Error en getDashboardStats:', error);
    return { success: false, message: 'Error al obtener estadísticas', data: null };
  }
}

// Obtener ventas por período (últimos 7 días)
export async function getSalesByPeriod() {
  const token = await getToken();
  if (!token) {
    return { success: false, message: 'No autenticado', data: null };
  }

  try {
    const response = await fetch(`${process.env.BACK_URL}/sales`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const sales = await response.json();

    if (!Array.isArray(sales)) {
      return { success: true, data: [] };
    }

    // Agrupar ventas por día (últimos 7 días)
    const today = new Date();
    const last7Days = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const daySales = sales.filter(sale => {
        const saleDate = new Date(sale.createdAt).toISOString().split('T')[0];
        return saleDate === dateStr;
      });

      const dayRevenue = daySales.reduce((sum, sale) => 
        sum + (parseFloat(sale.totalAmount) || 0), 0
      );

      last7Days.push({
        date: dateStr,
        day: date.toLocaleDateString('es-ES', { weekday: 'short' }),
        sales: daySales.length,
        revenue: dayRevenue
      });
    }

    return { success: true, data: last7Days };
  } catch (error) {
    console.error('Error en getSalesByPeriod:', error);
    return { success: false, message: 'Error al obtener ventas por período', data: null };
  }
}

// Obtener top productos más vendidos
export async function getTopProducts(limit = 5) {
  const token = await getToken();
  if (!token) {
    return { success: false, message: 'No autenticado', data: null };
  }

  try {
    const salesRes = await fetch(`${process.env.BACK_URL}/sales`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const sales = await salesRes.json();

    if (!Array.isArray(sales)) {
      return { success: true, data: [] };
    }

    // Contar productos vendidos
    const productSales: { [key: string]: { count: number; name: string; revenue: number } } = {};

    sales.forEach(sale => {
      if (sale.items && Array.isArray(sale.items)) {
        sale.items.forEach((item: any) => {
          const productId = item.productId;
          if (!productSales[productId]) {
            productSales[productId] = {
              count: 0,
              name: item.product?.name || `Producto ${productId.substring(0, 8)}`,
              revenue: 0
            };
          }
          productSales[productId].count += item.quantity || 0;
          productSales[productId].revenue += (item.quantity || 0) * (parseFloat(item.unitPrice) || 0);
        });
      }
    });

    // Convertir a array y ordenar
    const topProducts = Object.entries(productSales)
      .map(([id, data]) => ({
        id,
        name: data.name,
        unitsSold: data.count,
        revenue: data.revenue
      }))
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, limit);

    return { success: true, data: topProducts };
  } catch (error) {
    console.error('Error en getTopProducts:', error);
    return { success: false, message: 'Error al obtener top productos', data: null };
  }
}

// Obtener distribución de ventas por estado
export async function getSalesDistribution() {
  const token = await getToken();
  if (!token) {
    return { success: false, message: 'No autenticado', data: null };
  }

  try {
    const response = await fetch(`${process.env.BACK_URL}/sales`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const sales = await response.json();

    if (!Array.isArray(sales)) {
      return { success: true, data: [] };
    }

    const distribution = sales.reduce((acc: any, sale) => {
      const status = sale.status || 'unknown';
      if (!acc[status]) {
        acc[status] = { name: status, value: 0, count: 0 };
      }
      acc[status].count += 1;
      acc[status].value += parseFloat(sale.totalAmount) || 0;
      return acc;
    }, {});

    return { 
      success: true, 
      data: Object.values(distribution) 
    };
  } catch (error) {
    console.error('Error en getSalesDistribution:', error);
    return { success: false, message: 'Error al obtener distribución', data: null };
  }
}
