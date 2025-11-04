"use client"
import { useEffect, useState } from "react";
import { getSales } from "@/app/actions/sales/sales";
import SalesTable from "@/components/sales/SalesTable"; 
import { Button } from "flowbite-react";
import Link from "next/link";

export default function SalesPage() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    (async () => {
      const salesData = await getSales();
      setSales(salesData);
    })()
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Módulo de Ventas
        </h1>
        <Link href="/sales/create">
          <Button color="blue" size="lg">
            + Crear Nueva Venta
          </Button>
        </Link>
      </div>
      <SalesTable sales={sales} />
    </div>
  );
}