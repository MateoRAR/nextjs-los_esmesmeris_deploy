"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/app/actions/products";
import { Product, productFields, productFieldMetadata } from "@/app/types/product";

type ProductFormState = Omit<Product, "id" | "supplier">;

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();

  const [form, setForm] = useState<ProductFormState>(() => {
    if (product) {
      const { id, supplier, ...rest } = product;
      return rest;
    }
    return { ...productFields };
  });

  useEffect(() => {
    if (product) {
      const { id, supplier, ...rest } = product;
      setForm(rest);
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (product) await updateProduct(product.id, form);
    else await createProduct(form);
    router.push("/products");
  };

  const getInputType = (value: any): string => {
    if (typeof value === "number") return "number";
    if (typeof value === "boolean") return "checkbox";
    if (value instanceof Date) return "date";
    return "text";
  };

  const isEnum = (key: string): boolean => {
    return productFieldMetadata[key]?.type === 'enum';
  };

  const getEnumOptions = (key: string) => {
    const metadata = productFieldMetadata[key];
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
        {product ? "Editar producto" : "Nuevo producto"}
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
                required
                rows={4}
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
              />
            </div>
          );
        }

        // Si es creationDate, renderiza un input date
        if (key === "creationDate") {
          const dateValue = value instanceof Date 
            ? value.toISOString().split('T')[0]
            : value && typeof value === 'string'
            ? new Date(value).toISOString().split('T')[0]
            : "";
          
          return (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-600">
                {formatLabel(key)}
              </label>
              <input
                name={key}
                type="date"
                value={dateValue}
                onChange={(e) => {
                  setForm(prev => ({
                    ...prev,
                    [key]: e.target.value ? new Date(e.target.value) : null,
                  }));
                }}
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
              value={String(value ?? "")}
              onChange={handleChange}
              required={key !== "creationDate"}
              step={key === "price" ? "0.01" : undefined}
              min={key === "price" || key === "stock" ? "0" : undefined}
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
            />
          </div>
        );
      })}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        {product ? "Actualizar" : "Crear"}
      </button>
    </form>
  );
}

