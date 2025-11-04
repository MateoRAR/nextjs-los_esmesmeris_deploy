export type DisposalStatus = "pending" | "approved" | "rejected" | "completed";

export interface Disposal {
  id: string;
  employeeId: string;
  status: DisposalStatus;
  totalPrice: number;
  unitPrice: number;
  notes?: string;
  productName: string;
  productDescription: string;
  productStock: number;
  productCategory: string;
  supplierId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}


