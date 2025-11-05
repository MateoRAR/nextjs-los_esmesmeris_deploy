'use client';

import { createCustomer } from '@/app/actions/customers/customers';
import { CreateCustomerFormState } from '@/app/lib/customers/definition';
import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ErrorAlert from '@/components/error-alert/ErrorAlert';
import { Button, Label, TextInput, Spinner, Card } from 'flowbite-react';
import Link from 'next/link';

const initialState: CreateCustomerFormState = {
  message: '',
  success: false,
};

interface CreateCustomerFormProps {
  initialCardId?: string;
  onCustomerCreated?: (customer: any) => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export default function CreateCustomerForm({ 
  initialCardId = '', 
  onCustomerCreated, 
  onCancel,
  isModal = false 
}: CreateCustomerFormProps) {
  
  const router = useRouter();
  const [state, formAction, pending] = useActionState(createCustomer, initialState);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (state?.success && state.data) {
      if (onCustomerCreated) {
        onCustomerCreated(state.data);
      } else {
        router.push('/customers');
      }
    }
  }, [state, onCustomerCreated, router]);

  return (
    <>
      {!isModal && (
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Registrar Nuevo Cliente
        </h2>
      )}

      {state?.message && !state.success && (
        <ErrorAlert message={state.message} />
      )}

      <form action={formAction} className="mt-6 space-y-6">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="cardId">Cédula / ID</Label>
          </div>
          <TextInput
            id="cardId"
            name="cardId"
            type="text"
            defaultValue={initialCardId} 
            required
            readOnly={isModal && !!initialCardId}
          />
          {state?.errors?.cardId && (
            <div id="cardId-error" aria-live="polite" className="mt-1 text-sm text-red-600">
              {state.errors.cardId.map((error: string) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="name">Nombre Completo</Label>
          </div>
          <TextInput
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {state?.errors?.name && (
            <div id="name-error" aria-live="polite" className="mt-1 text-sm text-red-600">
              {state.errors.name.map((error: string) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="email">Correo Electrónico</Label>
          </div>
          <TextInput
            id="email"
            name="email"
            type="email"
            placeholder="john.doe@correo.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {state?.errors?.email && (
            <div id="email-error" aria-live="polite" className="mt-1 text-sm text-red-600">
              {state.errors.email.map((error: string) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            color="blue"
            disabled={pending}
            className="flex-1"
          >
            {pending ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Guardando...
              </>
            ) : (
              'Guardar Cliente'
            )}
          </Button>
          
          {isModal && onCancel ? (
            <Button color="gray" disabled={pending} className="flex-1" onClick={onCancel}>
              Cancelar
            </Button>
          ) : (
            <Link href="/customers">
              <Button color="gray" disabled={pending} className="flex-1">
                Cancelar
              </Button>
            </Link>
          )}
        </div>
      </form>
    </>
  );
}

