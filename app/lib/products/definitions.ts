import { z } from 'zod';

export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
};

export type SaleItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export const SaleItemSchema = z.object({
  productId: z.string().min(1, 'Debe seleccionar un producto'),
  quantity: z.coerce.number().positive('La cantidad debe ser mayor a 0'),
  unitPrice: z.coerce.number().positive('El precio debe ser mayor a 0'),
});
