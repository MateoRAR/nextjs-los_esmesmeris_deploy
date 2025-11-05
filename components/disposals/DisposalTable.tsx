"use client";

import { Disposal } from "@/app/types/disposal";
import { deleteDisposal } from "@/app/actions/disposals";
import Link from "next/link";
import { useTransition } from "react";

export default function DisposalTable({ disposals }: { disposals: Disposal[] }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (confirm("¿Eliminar esta disposición?")) {
      startTransition(() => deleteDisposal(id));
    }
  };

  // Vacío
  if (!disposals || disposals.length === 0) {
    return (
      <div className="text-center text-gray-500 py-6 bg-white shadow-md rounded-xl">
        No hay disposiciones registradas.
      </div>
    );
  }

  // Columnas dinámicas del primer elemento
  const columns = Object.keys(disposals[0]).filter(
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
          {disposals.map((item) => (
            <tr key={item.id} className="border-b hover:bg-gray-50">
              {columns.map((key) => (
                <td key={key} className="px-6 py-4">
                  {String((item as any)[key] ?? "")}
                </td>
              ))}
              <td className="px-6 py-4 text-right">
                <Link
                  href={`/disposals/${item.id}`}
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


