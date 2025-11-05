"use client"
import { useUserStore } from '@/store/userInfoStore';
import { useEffect, useState } from 'react';
import { 
  getDashboardStats, 
  getSalesByPeriod, 
  getTopProducts,
  getSalesDistribution 
} from '@/app/actions/dashboard/dashboard';
import DashboardKPIs from '@/components/dashboard/DashboardKPIs';
import SalesBarChart from '@/components/dashboard/SalesBarChart';
import SalesPieChart from '@/components/dashboard/SalesPieChart';
import TopProductsTable from '@/components/dashboard/TopProductsTable';
import { Spinner } from 'flowbite-react';

export default function Home() {
  const { name } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [salesByDay, setSalesByDay] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [salesDistribution, setSalesDistribution] = useState<any[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [statsRes, salesByDayRes, topProductsRes, distributionRes] = await Promise.all([
          getDashboardStats(),
          getSalesByPeriod(),
          getTopProducts(5),
          getSalesDistribution()
        ]);

        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data);
        }
        if (salesByDayRes.success && salesByDayRes.data) {
          setSalesByDay(salesByDayRes.data);
        }
        if (topProductsRes.success && topProductsRes.data) {
          setTopProducts(topProductsRes.data);
        }
        if (distributionRes.success && distributionRes.data) {
          setSalesDistribution(distributionRes.data);
        }
      } catch (error) {
        console.error('Error cargando dashboard:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">No se pudieron cargar los datos del dashboard</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Bienvenido, {name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Dashboard de Métricas y Análisis
        </p>
      </div>

      {/* KPIs */}
      <DashboardKPIs stats={stats} />

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesBarChart data={salesByDay} />
        <SalesPieChart data={salesDistribution} />
      </div>

      {/* Tabla de top productos */}
      <TopProductsTable products={topProducts} />
    </div>
  );
}
