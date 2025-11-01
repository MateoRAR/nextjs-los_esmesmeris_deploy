'use server'
import { SignInFormSchema, SignInFormState } from '@/app/lib/definitions'
import { redirect } from 'next/navigation'
import {createSession, deleteSession} from '@/app/lib/session'

export async function signIn(prevState:any,formData: FormData) {
  const validatedFields = SignInFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })
  const response = await fetch(process.env.BACK_URL+'/auth/login',
                               {method: "POST",body: JSON.stringify(validatedFields.data),
                                 headers: {
                                   "Content-Type": "application/json",
                                 }
  });
  const body =await response.json();
  if (!body.success) {
    return {
      success: false,
      message: 'Invalid Credentials',
      user:{
        id: "",
        role: "",
        name:""
      }
    }
  }
  const token= body.token;
  await createSession(token);
  //Datos para crear la sesion.
  console.log(body);
  return {
    success: true,
    message: '',
    user: {
      id: body.user.id,
      role: body.user.role,
      name:body.user.name
    }
  }
}

export async function logout() {
  await deleteSession()
  redirect('/login')
}
