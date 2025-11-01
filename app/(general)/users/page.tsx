"use client"
import { useEffect, useState } from "react";
import { getUsers } from "@/app/actions/users/users";
export default function Home() {
  const [users, setUsers] = useState();

  useEffect(() => {
    (async () => {
      const users = await getUsers();
      setUsers(users);
      console.log(users)
    })()

  }, [])

  return (
    <div>
     
      Usuarios
    </div>
  );
}

