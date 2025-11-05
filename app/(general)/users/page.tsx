"use client"
import { useEffect, useState } from "react";
import { getUsers } from "@/app/actions/users/users";
import UsersTable from "@/components/users/usersTable"
import CreateUser from "@/components/users/createUser"

import { useRouter } from 'next/navigation'
import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
export default function Users() {
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const users = await getUsers();
      setUsers(users);
    })()
  }, [])

  return (
    <div>
      <Button onClick={()=>{router.push('/users/create')}}>  Create User </Button>
     <UsersTable users={users}/>
    </div>
  );
}

