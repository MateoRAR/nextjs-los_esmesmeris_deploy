"use client";

import { deleteUser } from "@/app/actions/users/users";
import { Modal } from "flowbite-react";
import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeleteUserModal({ userId }: { userId: string }) {
  const [openModal, setOpenModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteUser(userId);
      setOpenModal(false);
      router.push("/users");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting user:", error);
      setDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpenModal(true)}
        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
      >
        <Trash2 className="w-4 h-4" />
        Eliminar
      </button>

      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
        dismissible
      >
        <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6">
          <button
            onClick={() => setOpenModal(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              ¿Eliminar Usuario?
            </h3>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              Esta acción no se puede deshacer. El usuario será eliminado permanentemente del sistema.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? "Eliminando..." : "Sí, eliminar"}
              </button>
              <button
                onClick={() => setOpenModal(false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}



