'use server'
import { decryptSession, getToken } from '@/app/lib/auth/session';
import { cookies } from 'next/headers'

export async function getUsers() {
  const ans = await fetch(process.env.BACK_URL + '/users', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${await getToken()}`
    },

  })
  const json = await ans.json();
  //form json to array
  return json;
}
export async function getUser(id:string) {
  const ans = await fetch(process.env.BACK_URL + '/users/'+id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${await getToken()}`
    },

  })
  const json = await ans.json();
  return json;
}

export async function updateUser(prevState:any, formData: FormData){
  // transformar a objeto
  const dataObject = Object.fromEntries(formData);
  // EXCLUIR EL 'id' usando desestructuración
  // creamos un nuevo objeto 'dataWithoutId' que incluye todo lo de dataObject,
  // excepto la propiedad 'id' (que se guarda temporalmente).
  const { id, ...dataWithoutId } = dataObject;

  // serializar el objeto SIN el 'id' a JSON
  const jsonData = JSON.stringify(dataWithoutId);


  const response = await fetch(process.env.BACK_URL + '/users/'+formData.get('id'),{method: "PATCH", body: jsonData,
    headers: {
    "Content-Type": "application/json",
    'Authorization': `Bearer ${await getToken()}`
    }
  });

  if(!response.ok){
    const errorMessage = (await response.json()).message;
    return {
      success: false,
      message: "Invalid fields" 
    }
  }
  const body = await response.json();
  return {
     success: true,
     message: "The operation was completed succesfully" 
  }
  
}

export async function createUser(prevState:any, formData: FormData){
  // transformar a objeto
  const dataObject = Object.fromEntries(formData);
  // EXCLUIR EL 'id' usando desestructuración
  // creamos un nuevo objeto 'dataWithoutId' que incluye todo lo de dataObject,
  // excepto la propiedad 'id' (que se guarda temporalmente).
  // serializar el objeto SIN el 'id' a JSON
  const jsonData = JSON.stringify(dataObject);


  const response = await fetch(process.env.BACK_URL + '/users',{method: "POST", body: jsonData,
    headers: {
    "Content-Type": "application/json",
    'Authorization': `Bearer ${await getToken()}`
    }
  });

  if(!response.ok){
    const errorMessage = (await response.json()).message;
    return {
      success: false,
      message: errorMessage
    }
  }
  const body = await response.json();
  return {
     success: true,
     message: "The operation was completed succesfully" 
  }
  
}



export async function deleteUser(id:string) {
  const ans = await fetch(process.env.BACK_URL + '/users/'+id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${await getToken()}`
    },

  })
  console.log(ans);
  const json = await ans.json();
  return json;
}
