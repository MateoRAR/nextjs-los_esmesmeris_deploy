"use client"
import { useEffect, useState } from "react";
import { getSales } from "@/app/actions/sales/sales";
import { searchCustomersByName } from "@/app/actions/customers/customers";
import { searchUsersByName } from "@/app/actions/users/users";
import SalesTable from "@/components/sales/SalesTable"; 
import { Button, TextInput, Label, Select } from "flowbite-react";
import Link from "next/link";

export default function SalesPage() {
  const [allSales, setAllSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'customer' | 'employee'>('customer');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const salesData = await getSales();
      setAllSales(salesData);
      setFilteredSales(salesData);
    })()
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setFilteredSales(allSales);
      return;
    }

    setLoading(true);

    try {
      if (searchType === 'customer') {
        // Buscar clientes por nombre
        const customersResult = await searchCustomersByName(searchTerm);
        
        if (customersResult.success && customersResult.data) {
          const customerIds = customersResult.data.map((c: any) => c.id);
          // Filtrar ventas por los IDs de clientes encontrados
          const filtered = allSales.filter((sale: any) => 
            customerIds.includes(sale.customerId)
          );
          setFilteredSales(filtered);
        } else {
          setFilteredSales([]);
        }
      } else {
        // Buscar empleados por nombre
        const usersResult = await searchUsersByName(searchTerm);
        
        if (usersResult.success && usersResult.data) {
          const employeeIds = usersResult.data.map((u: any) => u.id);
          // Filtrar ventas por los IDs de empleados encontrados
          const filtered = allSales.filter((sale: any) => 
            employeeIds.includes(sale.employeeId)
          );
          setFilteredSales(filtered);
        } else {
          setFilteredSales([]);
        }
      }
    } catch (error) {
      console.error('Error al buscar:', error);
      setFilteredSales([]);
    }

    setLoading(false);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setFilteredSales(allSales);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Módulo de Ventas
        </h1>
        <Link href="/sales/create">
          <Button color="blue" size="lg">
            + Crear Nueva Venta
          </Button>
        </Link>
      </div>

      {/* Buscador */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Buscar Ventas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-3">
            <Label htmlFor="searchType">Buscar por</Label>
            <Select
              id="searchType"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as 'customer' | 'employee')}
            >
              <option value="customer">Nombre del Cliente</option>
              <option value="employee">Nombre del Empleado</option>
            </Select>
          </div>
          <div className="md:col-span-6">
            <Label htmlFor="searchTerm">
              {searchType === 'customer' ? 'Nombre del Cliente' : 'Nombre del Empleado'}
            </Label>
            <TextInput
              id="searchTerm"
              type="text"
              placeholder="Escribe el nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="md:col-span-3 flex items-end gap-2">
            <Button 
              color="blue" 
              onClick={handleSearch}
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </Button>
            <Button 
              color="gray" 
              onClick={handleClearSearch}
              disabled={loading}
            >
              Limpiar
            </Button>
          </div>
        </div>
        {filteredSales.length !== allSales.length && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Mostrando {filteredSales.length} de {allSales.length} ventas
          </p>
        )}
      </div>

      <SalesTable sales={filteredSales} />
    </div>
  );
}