"use client";

import { Order } from "@/app/types/order";
import { deleteOrder } from "@/app/actions/orders";
import Link from "next/link";
import { useTransition } from "react";

export default function OrderTable({ orders }: { orders: Order[] }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (confirm("¿Eliminar esta orden?")) {
      startTransition(() => deleteOrder(id));
    }
  };

  // 🔹 Si no hay ordenes, muestra mensaje vacío
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center text-gray-500 py-6 bg-white shadow-md rounded-xl">
        No hay órdenes registradas.
      </div>
    );
  }

  // 🔹 Tomamos dinámicamente las claves del primer order
  // (exceptuando las que no queremos mostrar)
  const columns = Object.keys(orders[0]).filter(
    (key) => !["id", "createdAt", "updatedAt"].includes(key)
  );

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-xl">
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
          <tr>
            {columns.map((key) => (
              <th key={key} className="px-6 py-3 capitalize">
                {key}
              </th>
            ))}
            <th className="px-6 py-3 text-right">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((item) => (
            <tr key={item.id} className="border-b hover:bg-gray-50">
              {columns.map((key) => (
                <td key={key} className="px-6 py-4">
                  {String((item as any)[key] ?? "")}
                </td>
              ))}
              <td className="px-6 py-4 text-right">
                <Link
                  href={`/orders/${item.id}`}
                  className="text-blue-600 hover:underline mr-3"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={isPending}
                  className="text-red-600 hover:underline disabled:opacity-50"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

