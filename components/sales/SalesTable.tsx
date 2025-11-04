'use client';

import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button } from 'flowbite-react';
import { useState, useEffect } from 'react';

// Props: espera un array de ventas
export default function SalesTable({ sales }: { sales: any[] }) {
  
  // Se Define las keys (columnas) que quieres mostrar de tu objeto "sale"
  // Asumamos que una venta tiene: id, amount, customerId, createdAt
  const keysToShow: string[] = sales[0] ? Object.keys(sales[0]).filter((key) => 
    key === 'id' || key === 'amount' || key === 'customerId' || key === 'createdAt'
  ) : [];

  return (
    <div className="overflow-x-auto p-4">
      <Table hoverable>
        <TableHead>
          <TableRow>
            {keysToShow.map((key) => (
              <TableHeadCell key={key}>{key}</TableHeadCell>
            ))}
            <TableHeadCell>
              <span className="sr-only">Acciones</span>
            </TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          {sales.map((sale) => (
            <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800" key={sale.id + 'tablerow'}>
              {keysToShow.map((key) => (
                <TableCell key={sale.id + key}>
                  {/* Formatear la fecha si es 'createdAt' */}
                  {key === 'createdAt' ? new Date(sale[key]).toLocaleDateString() : sale[key]}
                </TableCell>
              ))}
              <TableCell className="flex gap-2">
                <Button size="xs" color="blue">Editar</Button>
                <Button size="xs" color="red">Eliminar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
