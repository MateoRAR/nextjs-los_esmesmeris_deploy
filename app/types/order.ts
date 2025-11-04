export enum OrderType {
  Disposal = "disposal",
  Sale = "sale",
}

export enum OrderStatus {
  Pending = "pending",
  InTransit = "in_transit",
  Delivered = "delivered",
  Cancelled = "cancelled",
}

export const orderFields = {
  relatedId: "",
  type: OrderType.Disposal,
  description: "",
  status: OrderStatus.Pending,
  lat: null as number | null,
  lng: null as number | null,
};

export const orderFieldMetadata: Record<string, { type: 'enum', options: any } | null> = {
  type: { type: 'enum', options: OrderType },
  status: { type: 'enum', options: OrderStatus },
};

export type OrderBase = typeof orderFields;

export interface Order extends OrderBase {
  id: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

