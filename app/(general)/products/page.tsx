"use client";

import { getProducts } from "@/app/actions/products";
import ProductTable from "@/components/products/ProductTable";
import Link from "next/link";
import { useState, useEffect, useTransition } from "react";
import { Product } from "@/app/types/product";
import { PackagePlus, Search } from "lucide-react";
import { Spinner } from "flowbite-react";

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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Productos
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Administra el catálogo de productos del sistema
          </p>
        </div>
        <Link
          href="/products/new"
          className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg overflow-hidden shadow-md shadow-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105"
        >
          <PackagePlus className="w-5 h-5 relative z-10" />
          <span className="relative z-10">Crear Producto</span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <label
          htmlFor="search"
          className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
        >
          Buscar producto por nombre
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Escribe el nombre del producto..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            disabled={isPending}
          />
          {isPending && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <Spinner size="sm" />
            </div>
          )}
        </div>
        {isPending && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Buscando productos...
          </p>
        )}
      </div>

      <ProductTable products={products} />
    </div>
  );
}

