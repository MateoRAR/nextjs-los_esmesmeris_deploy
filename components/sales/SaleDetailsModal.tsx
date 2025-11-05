'use client';

import { Modal, Badge, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { getSaleById } from '@/app/actions/sales/sales';

type SaleDetails = {
  id: string;
  customerId: string;
  employeeId: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items?: Array<{
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    product?: {
      name: string;
      description?: string;
    };
  }>;
  customer?: {
    id: string;
    name: string;
    cardId: string;
    email: string;
  };
  employee?: {
    id: string;
    name: string;
    email: string;
  };
};

interface SaleDetailsModalProps {
  show: boolean;
  saleId: string | null;
  onClose: () => void;
}

export default function SaleDetailsModal({ show, saleId, onClose }: SaleDetailsModalProps) {
  const [loading, setLoading] = useState(false);
  const [saleDetails, setSaleDetails] = useState<SaleDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (show && saleId) {
      loadSaleDetails();
    }
  }, [show, saleId]);

  const loadSaleDetails = async () => {
    if (!saleId) return;
    
    setLoading(true);
    setError(null);
    
    const result = await getSaleById(saleId);
    
    if (result.success && result.data) {
      setSaleDetails(result.data);
    } else {
      setError(result.message || 'Error al cargar los detalles');
    }
    
    setLoading(false);
  };

  return (
    <Modal show={show} onClose={onClose} dismissible size="4xl">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Detalles de la Venta
        </h2>
        
        {loading && (
          <div className="flex justify-center items-center py-8">
            <Spinner size="xl" />
            <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando detalles...</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-100 text-red-800 rounded-lg dark:bg-red-900 dark:text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && saleDetails && (
          <div className="space-y-6">
            {/* Información General */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">ID de Venta</p>
                <p className="font-medium text-gray-900 dark:text-white">{saleDetails.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Estado</p>
                <Badge 
                  color={saleDetails.status === 'completed' ? 'success' : saleDetails.status === 'pending' ? 'warning' : 'failure'}
                >
                  {saleDetails.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Fecha</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(saleDetails.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Monto Total</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ${typeof saleDetails.totalAmount === 'number' 
                    ? saleDetails.totalAmount.toFixed(2) 
                    : parseFloat(String(saleDetails.totalAmount)).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Información del Cliente */}
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 rounded">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Cliente</h3>
              {saleDetails.customer ? (
                <>
                  <p className="text-gray-900 dark:text-white">
                    <strong>Nombre:</strong> {saleDetails.customer.name}
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    <strong>Cédula:</strong> {saleDetails.customer.cardId}
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    <strong>Email:</strong> {saleDetails.customer.email}
                  </p>
                </>
              ) : (
                <p className="text-gray-500">ID: {saleDetails.customerId}</p>
              )}
            </div>

            {/* Información del Empleado */}
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Empleado</h3>
              {saleDetails.employee ? (
                <>
                  <p className="text-gray-900 dark:text-white">
                    <strong>Nombre:</strong> {saleDetails.employee.name}
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    <strong>Email:</strong> {saleDetails.employee.email}
                  </p>
                </>
              ) : (
                <p className="text-gray-500">ID: {saleDetails.employeeId}</p>
              )}
            </div>

            {/* Productos */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Productos</h3>
              {saleDetails.items && saleDetails.items.length > 0 ? (
                <div className="overflow-x-auto border rounded-lg dark:border-gray-700">
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th className="px-6 py-3">Producto</th>
                        <th className="px-6 py-3">Cantidad</th>
                        <th className="px-6 py-3">Precio Unit.</th>
                        <th className="px-6 py-3">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {saleDetails.items.map((item, index) => (
                        <tr key={item.id || `item-${index}`} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                          <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                            {item.product?.name || `Producto ${item.productId.substring(0, 8)}`}
                            {item.product?.description && (
                              <div className="text-xs text-gray-500">{item.product.description}</div>
                            )}
                          </td>
                          <td className="px-6 py-4">{item.quantity}</td>
                          <td className="px-6 py-4">
                            ${typeof item.unitPrice === 'number' 
                              ? item.unitPrice.toFixed(2) 
                              : parseFloat(String(item.unitPrice)).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 font-semibold">
                            ${typeof item.unitPrice === 'number' && typeof item.quantity === 'number'
                              ? (item.quantity * item.unitPrice).toFixed(2)
                              : (parseFloat(String(item.quantity)) * parseFloat(String(item.unitPrice))).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No hay productos en esta venta</p>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
