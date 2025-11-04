import * as z from 'zod';

export const CreateSaleFormSchema = z.object({
  customerId: z.string().min(1, { message: 'El ID del cliente es requerido.' }),
  totalAmount: z.coerce 
    .number({ invalid_type_error: 'El monto debe ser un número.' })
    .positive({ message: 'El monto debe ser positivo.' }),
});

export type CreateSaleFormState =
  | {
      errors?: {
        customerId?: string[];
        totalAmount?: string[];
      };
      message: string;
      success: boolean;
    }
  | undefined;

