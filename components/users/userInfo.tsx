"use client"
import { Button, Label, TextInput,Select } from "flowbite-react";
import {updateUser} from "@/app/actions/users/users"

import ErrorAlert from '@/components/error-alert/ErrorAlert';

import { useActionState, useEffect } from 'react'

import { useRouter } from 'next/navigation'
const initialState = {
  success: false,
  message: ''
}


export default function UserInfo({user}) {

  const router = useRouter()

  const [state, formAction, pending] = useActionState(updateUser, initialState);

  useEffect(() => {// setea el estado 
    console.log("CAMBIAA")
    console.log(state);
    if (state?.success ) {
      console.log("no entro");
      router.push('/users/'+user.id)
    }

  }, [state])

  console.log(user);
  if(!user){
    return null;
  }
  return (
    <div>
        {! state?.sucess&& (<ErrorAlert message={state.message} />)}
    <form action={formAction} >
    <TextInput id="id_employee" type="string" name='id'  defaultValue={user['id']} required hidden/>
    <div className="max-w-md">
    <div className="mb-2 block">
    <Label htmlFor="email">Email</Label>
    </div>
    <TextInput name="email" id="email" type="email"  placeholder="email@gmail.com" defaultValue={user['email']} required/>
    </div>



    <div className="max-w-md">
    <div className="mb-2 block">
    <Label htmlFor="name">Name</Label>
    </div>
    <TextInput name="name" id="name" type="string"  placeholder="Carlos Perez" defaultValue={user['name']} required/>
    </div>



    <div className="max-w-md">
    <div className="mb-2 block">
    <Label htmlFor="countries"> Role</Label>
    </div>
    <Select id="role" name="role" required>
    <option value="admin">admin</option>
    <option value="employee" >employee</option>
    </Select>
    </div>


    <div className="max-w-md">
    <div className="mb-2 block">
    <Label htmlFor="nationalId" >National ID</Label>
    </div>
    <TextInput id="nationalId" name="nationalId" type="string"  placeholder="id" defaultValue={user['nationalId']} />
    </div>


    <div className="max-w-md">
    <div className="mb-2 block">
    <Label htmlFor="hireDate" >Hire date</Label>
    </div>
    <TextInput id="hireDate" name="hireDate" type="date"  placeholder="date" defaultValue={user['hireDate']} />
    </div>


    <div className="max-w-md">
    <div className="mb-2 block">
    <Label htmlFor="hireDate">Salary</Label>
    </div>
    <input name="salary" id="salary" type="number"  placeholder="salary" defaultValue={user['salary']} step="any" min="0" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
    </div>

    <div className="m-8">
    <Button type="submit" >Save Changes</Button>
    </div>

    </form>

    <div className="m-8">
    </div>

    </div>
  );
}

