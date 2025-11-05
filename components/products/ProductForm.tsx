"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/app/actions/products";
import { Product, productFields, productFieldMetadata } from "@/app/types/product";
import { Save, ArrowLeft, Package } from "lucide-react";

type ProductFormState = Omit<Product, "id" | "supplier">;

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    
    try {
      if (product) await updateProduct(product.id, form);
      else await createProduct(form);
      router.push("/products");
    } finally {
      setIsSubmitting(false);
    }
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
    const labels: Record<string, string> = {
      name: "Nombre del Producto",
      description: "Descripción",
      price: "Precio",
      stock: "Stock / Inventario",
      category: "Categoría",
      creationDate: "Fecha de Creación",
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
          onClick={() => router.push("/products")}
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a productos
        </button>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 shadow-lg shadow-blue-500/30">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {product ? "Editar Producto" : "Nuevo Producto"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {product
                ? "Modifica la información del producto"
                : "Registra un nuevo producto en el catálogo"}
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
                    {formatLabel(key)} *
                  </label>
                  <textarea
                    name={key}
                    value={String(value ?? "")}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Describe el producto detalladamente..."
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
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
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
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
              );
            }

            // Para otros tipos, renderiza input
            const inputType = getInputType(value);
            const isRequired = key !== "creationDate";
            
            return (
              <div key={key}>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {formatLabel(key)} {isRequired && "*"}
                </label>
                <input
                  name={key}
                  type={inputType}
                  value={String(value ?? "")}
                  onChange={handleChange}
                  required={isRequired}
                  step={key === "price" ? "0.01" : undefined}
                  min={key === "price" || key === "stock" ? "0" : undefined}
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
              {isSubmitting ? "Guardando..." : product ? "Actualizar Producto" : "Crear Producto"}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          <button
            type="button"
            onClick={() => router.push("/products")}
            className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

