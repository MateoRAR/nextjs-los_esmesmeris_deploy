"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "../../lib/api";
import { Disposal } from "../../types/disposal";

export async function getDisposals(): Promise<Disposal[]> {
  return apiFetch<Disposal[]>("/disposals");
}

export async function getDisposal(id: string): Promise<Disposal> {
  return apiFetch<Disposal>(`/disposals/${id}`);
}

export async function createDisposal(data: Omit<Disposal, "id" | "createdAt" | "updatedAt">) {
  await apiFetch<Disposal>("/disposals", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidatePath("/disposals");
}

export async function updateDisposal(id: string, data: Partial<Disposal>) {
  await apiFetch<Disposal>(`/disposals/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  revalidatePath("/disposals");
}

export async function deleteDisposal(id: string) {
  await apiFetch(`/disposals/${id}`, { method: "DELETE" });
  revalidatePath("/disposals");
}


