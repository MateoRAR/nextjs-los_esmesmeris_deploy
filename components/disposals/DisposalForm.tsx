"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createDisposal, updateDisposal } from "@/app/actions/disposals";
import { Disposal, disposalFields, disposalFieldMetadata } from "@/app/types/disposal";

type DisposalFormState = Omit<Disposal, "id" | "createdAt" | "updatedAt">;

export default function DisposalForm({ disposal }: { disposal?: Disposal }) {
  const router = useRouter();

  const [form, setForm] = useState<DisposalFormState>(() => {
    if (disposal) {
      const { id, createdAt, updatedAt, ...rest } = disposal;
      return rest;
    }
    return { ...disposalFields };
  });

  useEffect(() => {
    if (disposal) {
      const { id, createdAt, updatedAt, ...rest } = disposal;
      setForm(rest);
    }
  }, [disposal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (disposal) await updateDisposal(disposal.id, form);
    else await createDisposal(form);
    router.push("/disposals");
  };

  const getInputType = (value: any): string => {
    if (typeof value === "number") return "number";
    if (typeof value === "boolean") return "checkbox";
    return "text";
  };

  const isEnum = (key: string): boolean => {
    return disposalFieldMetadata[key]?.type === 'enum';
  };

  const getEnumOptions = (key: string) => {
    const metadata = disposalFieldMetadata[key];
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
        {disposal ? "Editar disposición" : "Nueva disposición"}
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

        // Si es notes, renderiza un textarea
        if (key === "notes") {
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
              value={String(value ?? "")}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
            />
          </div>
        );
      })}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        {disposal ? "Actualizar" : "Crear"}
      </button>
    </form>
  );
}