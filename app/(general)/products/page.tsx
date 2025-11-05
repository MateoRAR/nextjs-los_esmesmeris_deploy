"use client";

import { getProducts } from "@/app/actions/products";
import ProductTable from "@/components/products/ProductTable";
import Link from "next/link";
import { useState, useEffect, useTransition } from "react";
import { Product } from "@/app/types/product";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();

  // Cargar productos iniciales
  useEffect(() => {
    startTransition(async () => {
      const data = await getProducts();
      setProducts(data);
    });
  }, []);

  // Filtrar productos cuando cambia el término de búsqueda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      startTransition(async () => {
        const data = await getProducts(searchTerm || undefined);
        setProducts(data);
      });
    }, 300); // Debounce de 300ms para evitar demasiadas peticiones

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Productos</h1>
        <Link
          href="/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Nuevo
        </Link>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
          Buscar producto por nombre
        </label>
        <input
          id="search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Escribe el nombre del producto..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isPending}
        />
        {isPending && (
          <p className="mt-2 text-sm text-gray-500">Buscando...</p>
        )}
      </div>
      <ProductTable products={products} />
    </div>
  );
}

