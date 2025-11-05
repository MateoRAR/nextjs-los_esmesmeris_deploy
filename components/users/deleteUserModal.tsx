"use client";

import {deleteUser} from "@/app/actions/users/users"
import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

import { useRouter } from 'next/navigation'
export default function DeleteUserModal({userId}) {
  const [openModal, setOpenModal] = useState(false);

  const router =useRouter();
  return (
    <>
    <Button
    onClick={() => setOpenModal(true)}
    style={{ backgroundColor: '#ff0000', color: 'white' }}
    >
    X 
    </Button>
    <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
    <ModalHeader />
    <ModalBody>
    <div className="text-center">
    <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
    Are you sure you want to this user?
    </h3>
    <div className="flex justify-center gap-4">
    <Button color="red" onClick={() => {setOpenModal(false); deleteUser(userId); router.push('/users');window.location.reload(false) }}>
    Yes, I'm sure
    </Button>
    <Button color="alternative" onClick={() => setOpenModal(false)}>
    No, cancel
    </Button>
    </div>
    </div>
    </ModalBody>
    </Modal>
    </>
  );
}

