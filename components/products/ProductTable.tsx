"use client";

import { Product } from "@/app/types/product";
import { deleteProduct } from "@/app/actions/products";
import Link from "next/link";
import { useTransition } from "react";

export default function ProductTable({ products }: { products: Product[] }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (confirm("¿Eliminar este producto?")) {
      startTransition(() => deleteProduct(id));
    }
  };

  // 🔹 Si no hay productos, muestra mensaje vacío
  if (!products || products.length === 0) {
    return (
      <div className="text-center text-gray-500 py-6 bg-white shadow-md rounded-xl">
        No hay productos registrados.
      </div>
    );
  }

  // 🔹 Tomamos dinámicamente las claves del primer product
  // (exceptuando las que no queremos mostrar)
  const columns = Object.keys(products[0]).filter(
    (key) => !["id", "supplier"].includes(key)
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
          {products.map((item) => (
            <tr key={item.id} className="border-b hover:bg-gray-50">
              {columns.map((key) => (
                <td key={key} className="px-6 py-4">
                  {key === "creationDate" && (item as any)[key]
                    ? new Date((item as any)[key]).toLocaleDateString()
                    : String((item as any)[key] ?? "")}
                </td>
              ))}
              <td className="px-6 py-4 text-right">
                <Link
                  href={`/products/${item.id}`}
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

