"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createOrder, updateOrder } from "@/app/actions/orders";
import { Order, orderFields, orderFieldMetadata } from "@/app/types/order";

type OrderFormState = Partial<Omit<Order, "id" | "createdAt" | "updatedAt">>;

export default function OrderForm({ order }: { order?: Order }) {
  const router = useRouter();

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
    
    if (order) await updateOrder(order.id, form);
    else await createOrder(form);
    router.push("/orders");
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
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md space-y-4"
    >
      <h2 className="text-lg font-semibold text-gray-700">
        {order ? "Editar orden" : "Nueva orden"}
      </h2>

      {Object.entries(form).map(([key, value]) => {
        // Si es un enum, renderiza un select
        if (isEnum(key)) {
          return (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-600">
                {formatLabel(key)}
              </label>
              <select
                name={key}
                value={String(value)}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
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
            <div key={key}>
              <label className="block text-sm font-medium text-gray-600">
                {formatLabel(key)}
              </label>
              <textarea
                name={key}
                value={String(value ?? "")}
                onChange={handleChange}
                rows={3}
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
              />
            </div>
          );
        }

        // Para otros tipos, renderiza input
        const inputType = getInputType(value);
        return (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-600">
              {formatLabel(key)}
            </label>
            <input
              name={key}
              type={inputType}
              value={value === null ? "" : String(value)}
              onChange={handleChange}
              required={key !== "description" && key !== "lat" && key !== "lng"}
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
            />
          </div>
        );
      })}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        {order ? "Actualizar" : "Crear"}
      </button>
    </form>
  );
}

