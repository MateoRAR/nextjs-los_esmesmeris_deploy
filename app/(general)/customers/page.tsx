'use client';

import CreateCustomerForm from '@/components/customers/CreateCustomerForm';
import { Card } from 'flowbite-react';

export default function CreateCustomerPage() {
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <Card className="sm:mx-auto sm:w-full sm:max-w-md">
        <CreateCustomerForm />
      </Card>
    </div>
  );
}
