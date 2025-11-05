"use client";

import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { useState } from "react";

export default function saveUserChanges() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Button onClick={() => setOpenModal(true)}>Save Changes</Button>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <ModalHeader>Are you sure you want to save changes?</ModalHeader>
        <ModalFooter>
          <Button onClick={() => setOpenModal(false) } type="submit" >Yes</Button>
          <Button color="alternative" onClick={() => setOpenModal(false)}>
            No
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

