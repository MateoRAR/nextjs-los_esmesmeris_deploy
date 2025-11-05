'use client';

import { Card } from 'flowbite-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

interface SalesDistributionData {
  name: string;
  value: number;
  count: number;
}

interface SalesPieChartProps {
  data: SalesDistributionData[];
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const STATUS_LABELS: { [key: string]: string } = {
  'completed': 'Completadas',
  'pending': 'Pendientes',
  'cancelled': 'Canceladas',
  'unknown': 'Desconocido'
};

export default function SalesPieChart({ data }: SalesPieChartProps) {
  const chartData = data.map(item => ({
    ...item,
    displayName: STATUS_LABELS[item.name] || item.name
  }));

  return (
    <Card>
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Distribución de Ventas por Estado
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ displayName, percent }: any) => 
              `${displayName}: ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`${value} ventas`, 'Cantidad']}
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
