'use client';

import { createSale } from '@/app/actions/sales/sales';
import { getCustomerByCardId } from '@/app/actions/customers/customers';
import { searchProductsByName } from '@/app/actions/products/products';
import { CreateSaleFormSchema } from '@/app/lib/sales/definitions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ErrorAlert from '@/components/error-alert/ErrorAlert';
import SuccessAlert from '@/components/success-alert/SuccessAlert';
import { Button, Label, TextInput, Card, Spinner, Modal } from 'flowbite-react';
import Link from 'next/link';
import CreateCustomerForm from '@/components/customers/CreateCustomerForm';

type Customer = {
  id: string;
  name: string;
  cardId: string;
  email: string;
};

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
};

type SaleItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export default function CreateSaleForm() {
  const router = useRouter();

  // Estados para Cliente
  const [cardIdToSearch, setCardIdToSearch] = useState('');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Estados para Productos
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [productSearchResults, setProductSearchResults] = useState<Product[]>([]);
  const [productSearchLoading, setProductSearchLoading] = useState(false);
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [selectedQuantity, setSelectedQuantity] = useState<{ [key: string]: number }>({});

  // Estados para Venta
  const [saleLoading, setSaleLoading] = useState(false);
  const [saleError, setSaleError] = useState<string | null>(null);
  const [saleSuccess, setSaleSuccess] = useState<string | null>(null);

  // Función para buscar clientes
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

  // Función para buscar productos
  const handleSearchProduct = async () => {
    if (!productSearchTerm.trim()) {
      return;
    }
    setProductSearchLoading(true);
    const result = await searchProductsByName(productSearchTerm);
    
    if (result.success && result.data) {
      setProductSearchResults(result.data);
    } else {
      setProductSearchResults([]);
    }
    setProductSearchLoading(false);
  };

  // Función para agregar producto a la venta
  const handleAddProduct = (product: Product) => {
    const quantity = selectedQuantity[product.id] || 1;
    
    if (quantity > product.stock) {
      alert(`Stock insuficiente. Disponible: ${product.stock}`);
      return;
    }

    // Verificar si ya existe el producto
    const existingIndex = saleItems.findIndex(item => item.productId === product.id);
    
    if (existingIndex >= 0) {
      // Actualizar cantidad
      const updatedItems = [...saleItems];
      const newQuantity = updatedItems[existingIndex].quantity + quantity;
      
      if (newQuantity > product.stock) {
        alert(`Stock insuficiente. Disponible: ${product.stock}`);
        return;
      }
      
      updatedItems[existingIndex].quantity = newQuantity;
      updatedItems[existingIndex].subtotal = newQuantity * product.price;
      setSaleItems(updatedItems);
    } else {
      // Agregar nuevo item
      const newItem: SaleItem = {
        productId: product.id,
        productName: product.name,
        quantity,
        unitPrice: product.price,
        subtotal: quantity * product.price,
      };
      setSaleItems([...saleItems, newItem]);
    }
    
    // Limpiar búsqueda
    setSelectedQuantity({ ...selectedQuantity, [product.id]: 1 });
  };

  // Función para actualizar cantidad de producto en la venta
  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Si la cantidad es 0 o menor, eliminar el producto
      handleRemoveProduct(productId);
      return;
    }

    const updatedItems = saleItems.map(item => {
      if (item.productId === productId) {
        return {
          ...item,
          quantity: newQuantity,
          subtotal: newQuantity * item.unitPrice
        };
      }
      return item;
    });
    setSaleItems(updatedItems);
  };

  // Función para eliminar producto de la venta
  const handleRemoveProduct = (productId: string) => {
    setSaleItems(saleItems.filter(item => item.productId !== productId));
  };

  // Calcular total
  const totalAmount = saleItems.reduce((sum, item) => sum + item.subtotal, 0);

  // Función para crear la venta
  const handleCreateSale = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!customer) {
      setSaleError('Debe seleccionar un cliente para crear la venta.');
      return;
    }

    if (saleItems.length === 0) {
      setSaleError('Debe agregar al menos un producto a la venta.');
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

    const result = await createSale({
      ...validatedFields.data,
      items: saleItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    });

    if (result.success) {
      setSaleSuccess('¡Venta creada exitosamente!');
      setSaleLoading(false);
      
      // Esperar 2 segundos para que el usuario vea el mensaje de éxito
      setTimeout(() => {
        router.push('/sales');
      }, 2000);
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

          {/* Sección 2: Buscar y Agregar Productos */}
          <section className="space-y-4 border-b border-gray-200 pb-6 dark:border-gray-700 mt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">2. Buscar Producto</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="productSearch">Buscar por Nombre</Label>
              </div>
              <div className="flex gap-2">
                <TextInput
                  id="productSearch"
                  name="productSearch"
                  type="text"
                  placeholder="Nombre del producto..."
                  value={productSearchTerm}
                  onChange={(e) => setProductSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchProduct()}
                  className="flex-1"
                  disabled={!customer}
                />
                <Button 
                  color="blue" 
                  disabled={!customer || productSearchLoading} 
                  onClick={handleSearchProduct}
                >
                  {productSearchLoading ? <Spinner size="sm" /> : 'Buscar'}
                </Button>
              </div>
            </div>

            {/* Resultados de búsqueda de productos */}
            {productSearchResults.length > 0 && (
              <div className="mt-4 max-h-64 overflow-y-auto border rounded-lg dark:border-gray-700">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th className="px-6 py-3">Producto</th>
                      <th className="px-6 py-3">Precio</th>
                      <th className="px-6 py-3">Stock</th>
                      <th className="px-6 py-3">Cantidad</th>
                      <th className="px-6 py-3">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productSearchResults.map((product) => (
                      <tr key={product.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                          {product.name}
                          {product.description && (
                            <div className="text-xs text-gray-500">{product.description}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                        <td className="px-6 py-4">{product.stock}</td>
                        <td className="px-6 py-4">
                          <TextInput
                            type="number"
                            min="1"
                            max={product.stock}
                            value={selectedQuantity[product.id] || 1}
                            onChange={(e) => setSelectedQuantity({
                              ...selectedQuantity,
                              [product.id]: parseInt(e.target.value) || 1
                            })}
                            className="w-20"
                            sizing="sm"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            size="sm"
                            color="green"
                            onClick={() => handleAddProduct(product)}
                            disabled={product.stock === 0}
                          >
                            Agregar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Sección 3: Items de la Venta */}
          {saleItems.length > 0 && (
            <section className="space-y-4 mt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">3. Productos en la Venta</h3>
              <div className="max-h-64 overflow-y-auto border rounded-lg dark:border-gray-700">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                    <tr>
                      <th className="px-6 py-3">Producto</th>
                      <th className="px-6 py-3">Cantidad</th>
                      <th className="px-6 py-3">Precio Unit.</th>
                      <th className="px-6 py-3">Subtotal</th>
                      <th className="px-6 py-3">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {saleItems.map((item) => (
                      <tr key={item.productId} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                          {item.productName}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Button
                              size="xs"
                              color="gray"
                              onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                            >
                              -
                            </Button>
                            <TextInput
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleUpdateQuantity(item.productId, parseInt(e.target.value) || 1)}
                              className="w-16 text-center"
                              sizing="sm"
                            />
                            <Button
                              size="xs"
                              color="gray"
                              onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                        </td>
                        <td className="px-6 py-4">${item.unitPrice.toFixed(2)}</td>
                        <td className="px-6 py-4 font-bold">${item.subtotal.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <Button
                            size="sm"
                            color="failure"
                            onClick={() => handleRemoveProduct(item.productId)}
                          >
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Fila del Total */}
              <div className="border rounded-lg dark:border-gray-700 bg-gray-100 dark:bg-gray-700">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="font-bold">
                      <td colSpan={3} className="px-6 py-4 text-right text-gray-900 dark:text-white">
                        TOTAL:
                      </td>
                      <td className="px-6 py-4 text-xl text-blue-600 dark:text-blue-400">
                        ${totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Formulario de Envío */}
          <form onSubmit={handleCreateSale} className="mt-6 space-y-6">
            {saleSuccess && <SuccessAlert message={saleSuccess} />}
            {saleError && <ErrorAlert message={saleError} />}

            {/* Botones de Acción */}
            <div className="flex gap-4">
              <Button
                type="submit"
                color="blue"
                disabled={!customer || saleItems.length === 0 || saleLoading}
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
              <Link href="/sales">
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

