import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import {useState,useEffect} from "react"
export default function Component({users}) {
  // si users existe  entonces entonces accede a lo primero sino, array vacio
  const ignore=new Set(["createdAt","updatedAt"]);
  
  const keys= users[0] ? Object.keys(users[0]).filter((user)=>!ignore.has(user)) :[];  
  return (
    <div className="overflow-x-auto">
      <Table hoverable>
        <TableHead>
        <TableRow>
        {keys.map((key) => (
            
            <TableHeadCell key={key}>{key}</TableHeadCell>
        ))} 
            <TableHeadCell>
              <span className="sr-only">Edit</span>
            </TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">

        {users.map((user) => (
          <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800" key={user.id+"tablerow"}>

         {keys.map((key) => (

            <TableCell key={user+key}>{user[key]} </TableCell>
             

        ))}    

            <TableCell>
              <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                Edit
              </a>
            </TableCell>
          </TableRow>
        ))} 




        </TableBody>
      </Table>
    </div>
  );
}

