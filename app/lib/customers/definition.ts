import * as z from 'zod';

export const CreateCustomerFormSchema = z.object({
  name: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),
  cardId: z.string().min(5, { message: 'La cédula/ID es requerida.' }),
  email: z.string().email({ message: 'Por favor ingrese un email válido.' }),
});

export type CreateCustomerFormState =
  | {
      errors?: {
        name?: string[];
        cardId?: string[];
        email?: string[];
      };
      message: string;
      success: boolean;
    }
  | undefined;
