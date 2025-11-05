"use client";

import { Supplier } from "@/app/types/supplier";
import { deleteSupplier } from "@/app/actions/suppliers";
import Link from "next/link";
import { useTransition } from "react";

export default function SupplierTable({ suppliers }: { suppliers: Supplier[] }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (confirm("¿Eliminar este proveedor?")) {
      startTransition(() => deleteSupplier(id));
    }
  };

  // 🔹 Si no hay proveedores, muestra mensaje vacío
  if (!suppliers || suppliers.length === 0) {
    return (
      <div className="text-center text-gray-500 py-6 bg-white shadow-md rounded-xl">
        No hay proveedores registrados.
      </div>
    );
  }

  // 🔹 Tomamos dinámicamente las claves del primer supplier
  // (exceptuando las que no queremos mostrar)
  const columns = Object.keys(suppliers[0]).filter(
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
          {suppliers.map((supplier) => (
            <tr key={supplier.id} className="border-b hover:bg-gray-50">
              {columns.map((key) => (
                <td key={key} className="px-6 py-4">
                  {String((supplier as any)[key] ?? "")}
                </td>
              ))}
              <td className="px-6 py-4 text-right">
                <Link
                  href={`/suppliers/${supplier.id}`}
                  className="text-blue-600 hover:underline mr-3"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(supplier.id)}
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

