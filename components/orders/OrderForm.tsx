"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createOrder, updateOrder } from "@/app/actions/orders";
import { Order, orderFields, orderFieldMetadata } from "@/app/types/order";
import { Save, ArrowLeft, ShoppingCart } from "lucide-react";

type OrderFormState = Partial<Omit<Order, "id" | "createdAt" | "updatedAt">>;

export default function OrderForm({ order }: { order?: Order }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<OrderFormState>(() => {
    if (order) {
      const { id, createdAt, updatedAt, ...rest } = order;
      return rest;
    }
    const { type, lat, lng, ...base } = orderFields;
    return { ...base };
  });

  useEffect(() => {
    if (order) {
      const { id, createdAt, updatedAt, ...rest } = order;
      setForm(rest);
    }
  }, [order]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? null : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (order) await updateOrder(order.id, form);
      else await createOrder(form);
      router.push("/orders");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputType = (value: any): string => {
    if (typeof value === "number" || value === null) return "number";
    if (typeof value === "boolean") return "checkbox";
    return "text";
  };

  const isEnum = (key: string): boolean => {
    return orderFieldMetadata[key]?.type === 'enum';
  };

  const getEnumOptions = (key: string) => {
    const metadata = orderFieldMetadata[key];
    if (metadata?.type === 'enum') {
      return Object.values(metadata.options);
    }
    return [];
  };

  const formatLabel = (key: string): string => {
    const labels: Record<string, string> = {
      supplierId: "ID del Proveedor",
      productId: "ID del Producto",
      quantity: "Cantidad",
      orderDate: "Fecha de Orden",
      expectedDeliveryDate: "Fecha Esperada de Entrega",
      status: "Estado",
      totalCost: "Costo Total",
    };
    return labels[key] || key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/orders")}
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a órdenes
        </button>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 shadow-lg shadow-blue-500/30">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {order ? "Editar Orden" : "Nueva Orden"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {order
                ? "Modifica los detalles de la orden de compra"
                : "Registra una nueva orden de compra"}
            </p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(form).map(([key, value]) => {
            // Si es un enum, renderiza un select
            if (isEnum(key)) {
              return (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {formatLabel(key)} *
                  </label>
                  <select
                    name={key}
                    value={String(value)}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    {getEnumOptions(key).map((option) => (
                      <option key={String(option)} value={String(option)}>
                        {String(option)}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            // Si es description, renderiza un textarea
            if (key === "description") {
              return (
                <div key={key} className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {formatLabel(key)}
                  </label>
                  <textarea
                    name={key}
                    value={String(value ?? "")}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Información adicional (opcional)"
                  />
                </div>
              );
            }

            // Para otros tipos, renderiza input
            const inputType = getInputType(value);
            const isRequired = key !== "description" && key !== "lat" && key !== "lng";
            
            return (
              <div key={key}>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {formatLabel(key)} {isRequired && "*"}
                </label>
                <input
                  name={key}
                  type={inputType}
                  value={value === null ? "" : String(value)}
                  onChange={handleChange}
                  required={isRequired}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder={`Ingrese ${formatLabel(key).toLowerCase()}`}
                />
              </div>
            );
          })}
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-4 border-t dark:border-gray-700">
          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg overflow-hidden shadow-md shadow-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Save className="w-5 h-5 relative z-10" />
            <span className="relative z-10">
              {isSubmitting ? "Guardando..." : order ? "Actualizar Orden" : "Crear Orden"}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          <button
            type="button"
            onClick={() => router.push("/orders")}
            className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

