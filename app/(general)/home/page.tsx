"use client"
import { useUserStore } from '@/store/userInfoStore';

export default function Home() {
  const {id,role,name,isAuthenticated} = useUserStore(); // suscríbete a todo el store

  

  return (
    <div>
      <h1>Usuarios</h1>
      <p>Rol: {role}</p>
      <p>ID: {id}</p>
      <p>Nombre: {name}</p>
      <p>Autenticado: {isAuthenticated ? "Sí" : "No"}</p>
    </div>
  );
}