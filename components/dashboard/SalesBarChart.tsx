'use client';

import { Card } from 'flowbite-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface SalesByDayData {
  day: string;
  sales: number;
  revenue: number;
}

interface SalesBarChartProps {
  data: SalesByDayData[];
}

export default function SalesBarChart({ data }: SalesBarChartProps) {
  return (
    <Card>
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Ventas de los Últimos 7 Días
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <Legend />
          <Bar 
            yAxisId="left"
            dataKey="sales" 
            fill="#3b82f6" 
            name="Cantidad de Ventas" 
          />
          <Bar 
            yAxisId="right"
            dataKey="revenue" 
            fill="#10b981" 
            name="Ingresos ($)" 
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
