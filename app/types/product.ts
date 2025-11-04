// Define los campos base con sus valores por defecto
export const productFields = {
  name: "",
  description: "",
  price: 0,
  creationDate: null as Date | null,
  supplierId: "",
  stock: 0,
  category: "",
};

export const productFieldMetadata: Record<string, { type: 'enum', options: any } | null> = {
  // No hay enums en Product por ahora
};

export type ProductBase = typeof productFields;

export interface Product extends ProductBase {
  id: string;
  supplier?: {
    id: string;
    name: string;
  };
}

