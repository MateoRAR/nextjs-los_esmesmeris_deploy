'use client';

import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button, Badge } from 'flowbite-react';

export default function SalesTable({ sales }: { sales: any[] }) {
  
  // Si no hay ventas, mostrar mensaje
  if (!sales || sales.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        <p className="text-lg">No hay ventas registradas.</p>
        <p className="text-sm mt-2">Haz clic en "Crear Nueva Venta" para registrar tu primera venta.</p>
      </div>
    );
  }

  // Definir las columnas a mostrar para ventas
  const keysToShow = ['id', 'customerId', 'employeeId', 'totalAmount', 'status', 'createdAt'];

  return (
    <div className="overflow-x-auto">
      <Table hoverable>
        <TableHead>
          <TableRow>
            <TableHeadCell>ID</TableHeadCell>
            <TableHeadCell>Cliente</TableHeadCell>
            <TableHeadCell>Empleado</TableHeadCell>
            <TableHeadCell>Monto Total</TableHeadCell>
            <TableHeadCell>Estado</TableHeadCell>
            <TableHeadCell>Fecha</TableHeadCell>
            <TableHeadCell>
              <span className="sr-only">Acciones</span>
            </TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          {sales.map((sale) => (
            <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800" key={sale.id}>
              <TableCell className="font-medium text-gray-900 dark:text-white">
                {sale.id?.substring(0, 8)}...
              </TableCell>
              <TableCell>{sale.customerId?.substring(0, 8)}...</TableCell>
              <TableCell>{sale.employeeId?.substring(0, 8)}...</TableCell>
              <TableCell className="font-semibold">
                ${typeof sale.totalAmount === 'number' ? sale.totalAmount.toFixed(2) : sale.totalAmount}
              </TableCell>
              <TableCell>
                <Badge 
                  color={sale.status === 'completed' ? 'success' : sale.status === 'pending' ? 'warning' : 'failure'}
                >
                  {sale.status || 'pending'}
                </Badge>
              </TableCell>
              <TableCell>
                {sale.createdAt ? new Date(sale.createdAt).toLocaleDateString() : 'N/A'}
              </TableCell>
              <TableCell className="flex gap-2">
                <Button size="xs" color="blue">Ver Detalles</Button>
                <Button size="xs" color="red">Cancelar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
