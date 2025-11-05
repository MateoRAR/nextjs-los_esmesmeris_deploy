"use client"
import {notFound} from "next/navigation"
import {getUser} from "@/app/actions/users/users"
import {useState,useEffect} from "react"
import UserInfo from "@/components/users/userInfo"
interface Props {
  params: {
    id: string
  }
}
export default function UsersDetails({params}: Props){
  const [user,setUser]=useState();
  const [isFound,setIsFound]=useState(true);
  if (!isFound){
      notFound();
  }

  useEffect( ()=>{
    (async ()=>{
      const id=(await params).id;
      const response =await getUser(id);
      if(response.statusCode==404 || response.statusCode==500 ){
        setIsFound(false);
        return;
      }
      setUser(response);

    })();

  },[params]);

  return (
    <div> 
    <UserInfo user={user}/>
    </div>

  )
}
