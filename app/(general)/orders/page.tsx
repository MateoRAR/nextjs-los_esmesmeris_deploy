import { getOrders } from "@/app/actions/orders";
import OrderTable from "@/components/orders/OrderTable";
import Link from "next/link";
import { PackagePlus } from "lucide-react";

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Órdenes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Administra las órdenes de compra del sistema
          </p>
        </div>
        <Link
          href="/orders/new"
          className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg overflow-hidden shadow-md shadow-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105"
        >
          <PackagePlus className="w-5 h-5 relative z-10" />
          <span className="relative z-10">Crear Orden</span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>
      </div>

      <OrderTable orders={orders} />
    </div>
  );
}

