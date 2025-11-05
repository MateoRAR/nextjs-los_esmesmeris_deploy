"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "../../lib/api";
import { Order } from "../../types/order";

export async function getOrders(): Promise<Order[]> {
  return apiFetch<Order[]>("/orders");
}

export async function getOrder(id: string): Promise<Order> {
  return apiFetch<Order>(`/orders/${id}`);
}

export async function createOrder(data: Partial<Omit<Order, "id" | "createdAt" | "updatedAt">>) {
  await apiFetch<Order>("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidatePath("/orders");
}

export async function updateOrder(id: string, data: Partial<Order>) {
  await apiFetch<Order>(`/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  revalidatePath("/orders");
}

export async function deleteOrder(id: string) {
  await apiFetch(`/orders/${id}`, { method: "DELETE" });
  revalidatePath("/orders");
}

