"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "../../lib/api";
import { Product } from "../../types/product";

export async function getProducts(name?: string): Promise<Product[]> {
  const url = name ? `/products?name=${encodeURIComponent(name)}` : "/products";
  return apiFetch<Product[]>(url);
}

export async function getProduct(id: string): Promise<Product> {
  return apiFetch<Product>(`/products/${id}`);
}

export async function createProduct(data: Omit<Product, "id" | "supplier">) {
  await apiFetch<Product>("/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidatePath("/products");
}

export async function updateProduct(id: string, data: Partial<Product>) {
  await apiFetch<Product>(`/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  revalidatePath("/products");
}

export async function deleteProduct(id: string) {
  await apiFetch(`/products/${id}`, { method: "DELETE" });
  revalidatePath("/products");
}

