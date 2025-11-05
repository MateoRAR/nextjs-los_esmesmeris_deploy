'use client';

import { Alert } from 'flowbite-react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface SuccessAlertProps {
  message: string;
}

export default function SuccessAlert({ message }: SuccessAlertProps) {
  return (
    <Alert color="success" icon={CheckCircleIcon} className="mb-4">
      <span className="font-medium">¡Éxito!</span> {message}
    </Alert>
  );
}
