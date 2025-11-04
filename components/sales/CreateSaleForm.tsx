'use client';

import { createSale } from '@/app/actions/sales/sales';
import { getCustomerByCardId } from '@/app/actions/customers/customers';
import { CreateSaleFormSchema } from '@/app/lib/sales/definitions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ErrorAlert from '@/components/error-alert/ErrorAlert';
import { Button, Label, TextInput, Card, Spinner, Modal } from 'flowbite-react';
import Link from 'next/link';
import CreateCustomerForm from '@/components/customers/CreateCustomerForm'; // Importamos el formulario de cliente

type Customer = {
  id: string;
  name: string;
  cardId: string;
  email: string;
};

export default function CreateSaleForm() {
  const router = useRouter();

  const [cardIdToSearch, setCardIdToSearch] = useState('');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [totalAmount, setTotalAmount] = useState('');
  const [saleLoading, setSaleLoading] = useState(false);
  const [saleError, setSaleError] = useState<string | null>(null);

  const handleSearchCustomer = async () => {
    if (!cardIdToSearch) {
      setSearchError('Por favor ingrese una cédula.');
      return;
    }
    setSearchLoading(true);
    setSearchError(null);
    setCustomer(null);

    const result = await getCustomerByCardId(cardIdToSearch);

    if (result.success && result.data) {
      setCustomer(result.data);
    } else {
      setSearchError(result.message || 'Cliente no encontrado.');
    }
    setSearchLoading(false);
  };

  const handleCustomerCreated = (newCustomer: Customer) => {
    setCustomer(newCustomer); 
    setShowCreateModal(false);
    setSearchError(null); 
  };

  const handleCreateSale = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevenimos el envío de formulario estándar
    
    if (!customer) {
      setSaleError('Debe seleccionar un cliente para crear la venta.');
      return;
    }

    setSaleLoading(true);
    setSaleError(null);

    // Validamos con Zod en el cliente
    const validatedFields = CreateSaleFormSchema.safeParse({
      customerId: customer.id,
      totalAmount: totalAmount,
    });

    if (!validatedFields.success) {
      const errors = validatedFields.error.flatten().fieldErrors;
      const errorMsg = errors.totalAmount?.[0] || errors.customerId?.[0] || 'Datos inválidos.';
      setSaleError(errorMsg);
      setSaleLoading(false);
      return;
    }

    const result = await createSale(validatedFields.data);

    if (result.success) {
      router.push('/sales');
    } else {
      setSaleError(result.message || 'Ocurrió un error al crear la venta.');
      setSaleLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <Card className="sm:mx-auto sm:w-full sm:max-w-xl"> 
          <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Registrar Nueva Venta
          </h2>
          
          <section className="space-y-4 border-b border-gray-200 pb-6 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">1. Buscar Cliente</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="cardIdSearch">Buscar por Cédula (cardId)</Label>
              </div>
              <div className="flex gap-2">
                <TextInput
                  id="cardIdSearch"
                  name="cardIdSearch"
                  type="text"
                  placeholder="123456789"
                  value={cardIdToSearch}
                  onChange={(e) => setCardIdToSearch(e.target.value)}
                  className="flex-1"
                />
                <Button color="blue" disabled={searchLoading} onClick={handleSearchCustomer}>
                  {searchLoading ? <Spinner size="sm" /> : 'Buscar'}
                </Button>
              </div>
            </div>
            {searchError && (
              <div className="flex items-center justify-between">
                <ErrorAlert message={searchError} />
                <Button color="green" size="sm" onClick={() => setShowCreateModal(true)}>
                  Crear Cliente
                </Button>
              </div>
            )}
            {customer && (
              <div className="mt-4 p-4 rounded-lg bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <p className="font-bold">Cliente Seleccionado:</p>
                <p><strong>Nombre:</strong> {customer.name}</p>
                <p><strong>Email:</strong> {customer.email}</p>
                <p><strong>Cédula:</strong> {customer.cardId}</p>
              </div>
            )}
          </section>

          <form onSubmit={handleCreateSale} className="mt-6 space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">2. Detalles de la Venta</h3>
            
            <div>
              <div className="mb-2 block">
                <Label htmlFor="totalAmount">Monto Total</Label>
              </div>
              <TextInput
                id="totalAmount"
                name="totalAmount"
                type="number"
                step="0.01"
                placeholder="199.99"
                required
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                disabled={!customer || saleLoading}
              />
            </div>

            {saleError && <ErrorAlert message={saleError} />}

            {/* Botones de Acción */}
            <div className="flex gap-4">
              <Button
                type="submit"
                color="blue"
                disabled={!customer || saleLoading}
                className="flex-1"
              >
                {saleLoading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Guardando...
                  </>
                ) : (
                  'Guardar Venta'
                )}
              </Button>
              <Link href="/sales" legacyBehavior>
                <Button color="gray" disabled={saleLoading} className="flex-1">
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </Card>
      </div>

      <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Crear Nuevo Cliente
          </h3>
          <CreateCustomerForm
            initialCardId={cardIdToSearch}
            onCustomerCreated={handleCustomerCreated}
            onCancel={() => setShowCreateModal(false)}
            isModal={true}
          />
        </div>
      </Modal>
    </>
  );
}

