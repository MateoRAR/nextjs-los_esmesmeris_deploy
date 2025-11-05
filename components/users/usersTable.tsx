import { Table } from "flowbite-react";
import { useState, useEffect } from "react";
import DeleteUserModal from "components/users/deleteUserModal";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";

export default function UsersTable({ users }: { users: any[] }) {
  const ignore = new Set(["createdAt", "updatedAt", "password"]);
  const keys = users[0] ? Object.keys(users[0]).filter((user) => !ignore.has(user)) : [];

  // Formatear nombres de columnas
  const formatColumnName = (key: string) => {
    const columnNames: { [key: string]: string } = {
      id: "ID",
      name: "Nombre",
      email: "Correo",
      role: "Rol",
      nationalId: "Cédula",
      hireDate: "Fecha de Contratación",
      salary: "Salario"
    };
    return columnNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
  };

  // Formatear valores
  const formatValue = (key: string, value: any) => {
    if (key === "salary" && value) {
      return `$${parseFloat(value).toLocaleString('es-CO', { minimumFractionDigits: 2 })}`;
    }
    if (key === "hireDate" && value) {
      return new Date(value).toLocaleDateString('es-ES');
    }
    if (key === "role") {
      return value === "admin" ? "Administrador" : "Empleado";
    }
    if (key === "id") {
      return value.substring(0, 8) + "...";
    }
    return value;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <Table hoverable>
          <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
            <tr>
              {keys.map((key) => (
                <th
                  key={key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  {formatColumnName(key)}
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={keys.length + 1}
                  className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  No hay usuarios registrados
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  key={user.id + "tablerow"}
                >
                  {keys.map((key) => (
                    <td
                      key={user["id"] + key}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                    >
                      {key === "role" && (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            user[key] === "admin"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          }`}
                        >
                          {formatValue(key, user[key])}
                        </span>
                      )}
                      {key !== "role" && formatValue(key, user[key])}
                    </td>
                  ))}

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Link href={"/users/" + user["id"]}>
                        <button className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all">
                          <Edit className="w-4 h-4" />
                          Editar
                        </button>
                      </Link>

                      <DeleteUserModal userId={user["id"]} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
}


