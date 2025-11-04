export const supplierFields = {
  name: "",
  contact: "",
  phone: ""
}

export type SupplierBase = typeof supplierFields;

export interface Supplier extends SupplierBase {
  id: string;
}