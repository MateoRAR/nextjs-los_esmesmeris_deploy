"use client"
import { signIn } from '@/app/actions/auth/auth'
import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ErrorAlert from '@/components/error-alert/ErrorAlert';
import { useUserStore, UserStore } from '@/store/userInfoStore';


const initialState = {
  message: '',
  success: false,
  user: {
    id: "",
    role: "",
    name: ""
  }
}

export default function LoginForm() {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(signIn, initialState);


  const { setRole, setId, setName, setIsAuthenticated } = useUserStore();
  
  useEffect(() => {// setea el estado 


    if (state?.success && state.user) {
      setRole(state.user.role)
      setId(state.user.id)
      setName(state.user.name)
      setIsAuthenticated(true)
      router.push('/home')
      
    }
    


  }, [state])


  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-lg blur-xl opacity-50"></div>
              <svg className="relative h-16 w-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="7" rx="1" fill="#3B82F6" fillOpacity="0.9"/>
                <rect x="3" y="14" width="7" height="7" rx="1" fill="#60A5FA" fillOpacity="0.9"/>
                <rect x="14" y="3" width="7" height="7" rx="1" fill="#60A5FA" fillOpacity="0.9"/>
                <rect x="14" y="14" width="7" height="7" rx="1" fill="#93C5FD" fillOpacity="0.9"/>
                <circle cx="6.5" cy="6.5" r="1.5" fill="white"/>
                <circle cx="17.5" cy="17.5" r="1.5" fill="white"/>
              </svg>
            </div>
          </div>
          
          {/* Título */}
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
              Los Esmesmeris
            </h1>
            <p className="text-blue-400 font-medium text-sm mt-1">ERP</p>
            <h2 className="mt-6 text-xl font-semibold text-slate-200">
              Iniciar Sesión
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Accede a tu cuenta para continuar
            </p>
          </div>
        </div>
        
        {state?.message && (<ErrorAlert message={state.message} />)}

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-slate-800/50 backdrop-blur-sm px-8 py-10 shadow-2xl shadow-blue-500/10 rounded-2xl border border-slate-700/50">
            <form action={formAction} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-200 mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="block w-full rounded-lg bg-slate-900/50 border border-slate-600/50 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-200 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-lg bg-slate-900/50 border border-slate-600/50 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={pending}
                  className="group relative w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg overflow-hidden shadow-lg shadow-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/60 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span className="relative z-10">
                    {pending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </span>
                  <svg className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-400">
                ¿Necesitas ayuda? {' '}
                <a href="#" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  Contacta soporte
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

