"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createDisposal, updateDisposal } from "@/app/actions/disposals";
import { Disposal } from "@/app/types/disposal";

type DisposalFormState = Omit<Disposal, "id" | "createdAt" | "updatedAt">;

const NUMERIC_KEYS: Array<keyof DisposalFormState> = [
  "totalPrice",
  "unitPrice",
  "productStock",
];

export default function DisposalForm({ disposal }: { disposal?: Disposal }) {
  const router = useRouter();

  const [form, setForm] = useState<DisposalFormState>(
    disposal ? (({ id, createdAt, updatedAt, ...rest }) => rest)(disposal) : ({} as DisposalFormState)
  );

  useEffect(() => {
    if (disposal) {
      const { id, createdAt, updatedAt, ...rest } = disposal;
      setForm(rest);
    }
  }, [disposal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: NUMERIC_KEYS.includes(name as keyof DisposalFormState)
        ? Number(value)
        : value,
    } as DisposalFormState));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [
        k,
        NUMERIC_KEYS.includes(k as keyof DisposalFormState) ? Number(v as any) : v,
      ])
    ) as DisposalFormState;

    if (disposal) await updateDisposal(disposal.id, payload);
    else await createDisposal(payload);
    router.push("/disposals");
  };

  const excludedKeys: Array<keyof Disposal> = ["id", "createdAt", "updatedAt"];

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md space-y-4"
    >
      <h2 className="text-lg font-semibold text-gray-700">
        {disposal ? "Editar disposición" : "Nueva disposición"}
      </h2>

      {Object.entries(form)
        .filter(([key]) => !(excludedKeys as string[]).includes(key))
        .map(([key, value]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-600 capitalize">
              {key}
            </label>
            <input
              name={key}
              value={String(value ?? "")}
              onChange={handleChange}
              required={key !== "notes"}
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
            />
          </div>
        ))}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        {disposal ? "Actualizar" : "Crear"}
      </button>
    </form>
  );
}


