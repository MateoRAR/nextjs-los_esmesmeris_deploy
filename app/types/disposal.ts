export enum DisposalStatus {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected",
  Completed = "completed",
}

// Define los campos base con sus valores por defecto
export const disposalFields = {
  employeeId: "",
  status: DisposalStatus.Pending,
  totalPrice: 0,
  unitPrice: 0,
  notes: "",
  productName: "",
  productDescription: "",
  productStock: 0,
  productCategory: "",
  supplierId: "",
};

export const disposalFieldMetadata: Record<string, { type: 'enum', options: any } | null> = {
  status: { type: 'enum', options: DisposalStatus },
};

export type DisposalBase = typeof disposalFields;

export interface Disposal extends DisposalBase {
  id: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}