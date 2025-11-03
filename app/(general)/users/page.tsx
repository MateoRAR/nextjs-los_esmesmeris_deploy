"use client"
import { useEffect, useState } from "react";
import { getUsers } from "@/app/actions/users/users";
import UsersTable from "@/components/users/usersTable"
export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      const users = await getUsers();
      setUsers(users);
    })()
  }, [])

  return (
    <div>
     <UsersTable users={users}/>
    </div>
  );
}

