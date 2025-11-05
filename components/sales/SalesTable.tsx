'use client';

import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button, Badge, Modal } from 'flowbite-react';
import { useState } from 'react';
import SaleDetailsModal from './SaleDetailsModal';
import { cancelSale } from '@/app/actions/sales/sales';
import { AlertTriangle } from 'lucide-react';

export default function SalesTable({ sales }: { sales: any[] }) {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [saleToCancel, setSaleToCancel] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const handleViewDetails = (saleId: string) => {
    setSelectedSaleId(saleId);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedSaleId(null);
  };

  const handleCancelClick = (saleId: string) => {
    setSaleToCancel(saleId);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!saleToCancel) return;

    setCancelLoading(true);
    const result = await cancelSale(saleToCancel);

    if (result.success) {
      // Recargar la página para reflejar el cambio
      window.location.reload();
    } else {
      alert(result.message || 'Error al cancelar la venta');
    }

    setCancelLoading(false);
    setShowCancelModal(false);
    setSaleToCancel(null);
  };

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setSaleToCancel(null);
  };
  
  if (!sales || sales.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        <p className="text-lg">No hay ventas registradas.</p>
        <p className="text-sm mt-2">Haz clic en "Crear Nueva Venta" para registrar tu primera venta.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead>
            <TableRow>
              <TableHeadCell>ID</TableHeadCell>
              <TableHeadCell>Cliente</TableHeadCell>
              <TableHeadCell>Empleado</TableHeadCell>
              <TableHeadCell>Monto Total</TableHeadCell>
              <TableHeadCell>Estado</TableHeadCell>
              <TableHeadCell>Fecha</TableHeadCell>
              <TableHeadCell>
                <span className="sr-only">Acciones</span>
              </TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y">
            {sales.map((sale) => (
              <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800" key={sale.id}>
                <TableCell className="font-medium text-gray-900 dark:text-white">
                  {sale.id?.substring(0, 8)}...
                </TableCell>
                <TableCell>{sale.customerId?.substring(0, 8)}...</TableCell>
                <TableCell>{sale.employeeId?.substring(0, 8)}...</TableCell>
                <TableCell className="font-semibold">
                  ${typeof sale.totalAmount === 'number' ? sale.totalAmount.toFixed(2) : sale.totalAmount}
                </TableCell>
                <TableCell>
                  <Badge 
                    color={sale.status === 'completed' ? 'success' : sale.status === 'pending' ? 'warning' : 'failure'}
                  >
                    {sale.status === 'completed' ? 'Completada' : sale.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {sale.createdAt ? new Date(sale.createdAt).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button 
                    size="xs" 
                    color="blue"
                    onClick={() => handleViewDetails(sale.id)}
                  >
                    Ver Detalles
                  </Button>
                  <Button 
                    size="xs" 
                    color="red"
                    onClick={() => handleCancelClick(sale.id)}
                    disabled={sale.status === 'cancelled'}
                  >
                    {sale.status === 'cancelled' ? 'Cancelada' : 'Cancelar'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <SaleDetailsModal 
        show={showDetailsModal}
        saleId={selectedSaleId}
        onClose={handleCloseModal}
      />

      {/* Modal de Confirmación de Cancelación */}
      <Modal show={showCancelModal} onClose={handleCloseCancelModal} size="md">
        <div className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3">
              <AlertTriangle className="w-12 h-12 text-red-600 dark:text-red-500" />
            </div>
          </div>
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            ¿Estás seguro que deseas cancelar esta venta?
          </h3>
          <div className="flex justify-center gap-4">
            <Button
              color="failure"
              onClick={handleConfirmCancel}
              disabled={cancelLoading}
            >
              {cancelLoading ? 'Cancelando...' : 'Sí, cancelar venta'}
            </Button>
            <Button
              color="gray"
              onClick={handleCloseCancelModal}
              disabled={cancelLoading}
            >
              No, volver
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
