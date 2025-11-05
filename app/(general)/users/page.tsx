"use client"
import { useEffect, useState } from "react";
import { getUsers } from "@/app/actions/users/users";
import UsersTable from "@/components/users/usersTable"
import { useRouter } from 'next/navigation'
import { Spinner } from "flowbite-react";
import { UserPlus } from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const users = await getUsers();
      setUsers(users);
      setLoading(false);
    })()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Usuarios
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Administra los usuarios del sistema
          </p>
        </div>
        
        <button
          onClick={() => router.push('/users/create')}
          className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg overflow-hidden shadow-md shadow-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105"
        >
          <UserPlus className="w-5 h-5 relative z-10" />
          <span className="relative z-10">Crear Usuario</span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>

      {/* Table */}
      <UsersTable users={users} />
    </div>
  );
}


