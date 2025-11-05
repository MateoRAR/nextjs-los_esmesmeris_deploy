"use client";
import { Label, TextInput, Select } from "flowbite-react";
import { createUser } from "@/app/actions/users/users";
import ErrorAlert from "@/components/error-alert/ErrorAlert";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";

const initialState = {
  success: false,
  message: "",
};

export default function CreateUser() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(createUser, initialState);

  useEffect(() => {
    if (state?.success) {
      router.push("/users");
    }
  }, [state]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/users")}
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a usuarios
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Crear Nuevo Usuario
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Completa la información del nuevo usuario del sistema
        </p>
      </div>

      {!state?.success && state.message && <ErrorAlert message={state.message} />}

      {/* Formulario */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <form action={formAction} className="space-y-6">
          {/* Grid de 2 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div>
              <Label htmlFor="email" className="mb-2 block font-semibold">
                Correo Electrónico *
              </Label>
              <TextInput
                name="email"
                id="email"
                type="email"
                placeholder="usuario@empresa.com"
                required
                className="w-full"
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="mb-2 block font-semibold">
                Contraseña *
              </Label>
              <TextInput
                name="password"
                id="password"
                type="password"
                placeholder="••••••••"
                required
                className="w-full"
              />
            </div>

            {/* Name */}
            <div>
              <Label htmlFor="name" className="mb-2 block font-semibold">
                Nombre Completo *
              </Label>
              <TextInput
                name="name"
                id="name"
                type="text"
                placeholder="Carlos Pérez"
                required
                className="w-full"
              />
            </div>

            {/* Role */}
            <div>
              <Label htmlFor="role" className="mb-2 block font-semibold">
                Rol *
              </Label>
              <Select id="role" name="role" required className="w-full">
                <option value="">Seleccionar rol</option>
                <option value="admin">Administrador</option>
                <option value="employee">Empleado</option>
              </Select>
            </div>

            {/* National ID */}
            <div>
              <Label htmlFor="nationalId" className="mb-2 block font-semibold">
                Cédula
              </Label>
              <TextInput
                id="nationalId"
                name="nationalId"
                type="text"
                placeholder="1234567890"
                className="w-full"
              />
            </div>

            {/* Hire Date */}
            <div>
              <Label htmlFor="hireDate" className="mb-2 block font-semibold">
                Fecha de Contratación
              </Label>
              <TextInput
                id="hireDate"
                name="hireDate"
                type="date"
                className="w-full"
              />
            </div>

            {/* Salary */}
            <div className="md:col-span-2">
              <Label htmlFor="salary" className="mb-2 block font-semibold">
                Salario
              </Label>
              <input
                name="salary"
                id="salary"
                type="number"
                placeholder="3500000.00"
                step="0.01"
                min="0"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t dark:border-gray-700">
            <button
              type="submit"
              disabled={pending}
              className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg overflow-hidden shadow-md shadow-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Save className="w-5 h-5 relative z-10" />
              <span className="relative z-10">
                {pending ? "Guardando..." : "Guardar Usuario"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <button
              type="button"
              onClick={() => router.push("/users")}
              className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
