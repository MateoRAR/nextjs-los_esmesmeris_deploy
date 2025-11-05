"use client";

import { Order } from "@/app/types/order";
import { deleteOrder } from "@/app/actions/orders";
import Link from "next/link";
import { useTransition, useState } from "react";
import { Edit, Trash2, AlertTriangle, X, MapPin } from "lucide-react";
import { Modal } from "flowbite-react";

export default function OrderTable({ orders }: { orders: Order[] }) {
  const [isPending, startTransition] = useTransition();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (selectedId) {
      startTransition(() => {
        deleteOrder(selectedId);
        setShowDeleteModal(false);
        setSelectedId(null);
      });
    }
  };

  const formatColumnName = (key: string): string => {
    const columnNames: Record<string, string> = {
      supplierId: "ID Proveedor",
      productId: "ID Producto",
      quantity: "Cantidad",
      orderDate: "Fecha Orden",
      expectedDeliveryDate: "Fecha Esperada",
      status: "Estado",
      totalCost: "Costo Total",
    };
    return columnNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
  };

  const formatValue = (key: string, value: any): string => {
    if (value === null || value === undefined) return "-";
    
    // Format dates
    if ((key === "orderDate" || key === "expectedDeliveryDate") && typeof value === "string") {
      const date = new Date(value);
      return date.toLocaleDateString("es-ES");
    }
    
    // Format currency
    if (key === "totalCost" && typeof value === "number") {
      return value.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 2,
      });
    }

    // Format numbers
    if (key === "quantity" && typeof value === "number") {
      return value.toLocaleString("es-CO");
    }

    // Status translation
    if (key === "status") {
      const statusMap: Record<string, string> = {
        pending: "Pendiente",
        completed: "Completada",
        cancelled: "Cancelada",
      };
      return statusMap[String(value)] || String(value);
    }

    return String(value);
  };

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };
    
    const style = statusStyles[status] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    
    return (
      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${style}`}>
        {formatValue("status", status)}
      </span>
    );
  };

  // Empty state
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-12 bg-white dark:bg-gray-800 shadow-md rounded-xl">
        <p className="text-lg">No hay órdenes registradas</p>
      </div>
    );
  }

  // Dynamic columns from first order
  const columns = Object.keys(orders[0]).filter(
    (key) => !["id", "createdAt", "updatedAt"].includes(key)
  );

  return (
    <>
      <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-xl">
        <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs uppercase">
            <tr>
              {columns.map((key) => (
                <th key={key} className="px-6 py-4 font-semibold">
                  {formatColumnName(key)}
                </th>
              ))}
              <th className="px-6 py-4 text-right font-semibold">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {orders.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                {columns.map((key) => (
                  <td key={key} className="px-6 py-4">
                    {key === "status" ? (
                      getStatusBadge((item as any)[key])
                    ) : (
                      formatValue(key, (item as any)[key])
                    )}
                  </td>
                ))}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/orders/map?orderId=${item.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                      title="Ver tracking en el mapa"
                    >
                      <MapPin className="w-4 h-4" />
                      Tracking
                    </Link>
                    <Link
                      href={`/orders/${item.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(item.id)}
                      disabled={isPending}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} size="md">
        <div className="relative p-6">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              ¿Eliminar Orden?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Esta acción no se puede deshacer. La orden será eliminada permanentemente.
            </p>

            <div className="flex gap-3 w-full">
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-500 rounded-lg hover:shadow-lg hover:shadow-red-500/50 transition-all disabled:opacity-50"
              >
                {isPending ? "Eliminando..." : "Sí, eliminar"}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

