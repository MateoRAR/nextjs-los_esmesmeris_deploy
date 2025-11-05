'use client';

import { Card } from 'flowbite-react';
import { 
  ShoppingCart, 
  Users, 
  Package, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle 
} from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}

function KPICard({ title, value, icon, bgColor, textColor }: KPICardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className={`text-3xl font-bold mt-2 ${textColor}`}>
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-full ${bgColor}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

interface DashboardKPIsProps {
  stats: {
    totalSales: number;
    totalRevenue: number;
    totalCustomers: number;
    totalProducts: number;
    completedSales: number;
    pendingSales: number;
    lowStockProducts: number;
  };
}

export default function DashboardKPIs({ stats }: DashboardKPIsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <KPICard
        title="Ventas Totales"
        value={stats.totalSales}
        icon={<ShoppingCart className="w-6 h-6 text-blue-600" />}
        bgColor="bg-blue-100 dark:bg-blue-900"
        textColor="text-blue-600 dark:text-blue-400"
      />
      
      <KPICard
        title="Ingresos Totales"
        value={`$${stats.totalRevenue.toFixed(2)}`}
        icon={<TrendingUp className="w-6 h-6 text-green-600" />}
        bgColor="bg-green-100 dark:bg-green-900"
        textColor="text-green-600 dark:text-green-400"
      />
      
      <KPICard
        title="Clientes"
        value={stats.totalCustomers}
        icon={<Users className="w-6 h-6 text-purple-600" />}
        bgColor="bg-purple-100 dark:bg-purple-900"
        textColor="text-purple-600 dark:text-purple-400"
      />
      
      <KPICard
        title="Productos"
        value={stats.totalProducts}
        icon={<Package className="w-6 h-6 text-orange-600" />}
        bgColor="bg-orange-100 dark:bg-orange-900"
        textColor="text-orange-600 dark:text-orange-400"
      />
      
      <KPICard
        title="Ventas Completadas"
        value={stats.completedSales}
        icon={<CheckCircle className="w-6 h-6 text-emerald-600" />}
        bgColor="bg-emerald-100 dark:bg-emerald-900"
        textColor="text-emerald-600 dark:text-emerald-400"
      />
      
      <KPICard
        title="Ventas Pendientes"
        value={stats.pendingSales}
        icon={<ShoppingCart className="w-6 h-6 text-yellow-600" />}
        bgColor="bg-yellow-100 dark:bg-yellow-900"
        textColor="text-yellow-600 dark:text-yellow-400"
      />
      
      <KPICard
        title="Stock Bajo"
        value={stats.lowStockProducts}
        icon={<AlertTriangle className="w-6 h-6 text-red-600" />}
        bgColor="bg-red-100 dark:bg-red-900"
        textColor="text-red-600 dark:text-red-400"
      />
    </div>
  );
}
