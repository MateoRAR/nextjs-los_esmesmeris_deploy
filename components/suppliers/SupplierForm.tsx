"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupplier, updateSupplier } from "@/app/actions/suppliers";
import { Supplier, supplierFields } from "@/app/types/supplier";

export default function SupplierForm({ supplier }: { supplier?: Supplier }) {
  const router = useRouter();

  const [form, setForm] = useState<Omit<Supplier, "id">>(() => {
    if (supplier) {
      const { id, ...rest } = supplier;
      return rest;
    }
    return { ...supplierFields };
  });

  useEffect(() => {
    if (supplier) {
      const { id, ...rest } = supplier;
      setForm(rest);
    }
  }, [supplier]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (supplier) await updateSupplier(supplier.id, form);
    else await createSupplier(form);
    router.push("/suppliers");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md space-y-4"
    >
      <h2 className="text-lg font-semibold text-gray-700">
        {supplier ? "Editar proveedor" : "Nuevo proveedor"}
      </h2>

      {Object.entries(form).map(([key, value]) => (
        <div key={key}>
          <label className="block text-sm font-medium text-gray-600 capitalize">
            {key}
          </label>
          <input
            name={key}
            value={String(value)}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
          />
        </div>
      ))}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        {supplier ? "Actualizar" : "Crear"}
      </button>
    </form>
  );
}
