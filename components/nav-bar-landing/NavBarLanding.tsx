"use client"
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import LoginIcon from '@mui/icons-material/Login'

const navigation = [
  { name: 'Inicio', href: '/', current: false },
  { name: 'Acerca de', href: '/about', current: false },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function NavBarLanding() {
  return (
    <Disclosure as="nav" className="relative bg-slate-900/95 backdrop-blur-md border-b border-slate-800/50 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-20 items-center justify-between">
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-blue-500/10 hover:text-blue-400 focus:outline-2 focus:-outline-offset-1 focus:outline-blue-500 transition-all">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Abrir menú</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>

          {/* Logo y navegación */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <Link href="/" className="flex shrink-0 items-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <svg className="relative h-10 w-10 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="7" height="7" rx="1" fill="#3B82F6" fillOpacity="0.8"/>
                  <rect x="3" y="14" width="7" height="7" rx="1" fill="#60A5FA" fillOpacity="0.8"/>
                  <rect x="14" y="3" width="7" height="7" rx="1" fill="#60A5FA" fillOpacity="0.8"/>
                  <rect x="14" y="14" width="7" height="7" rx="1" fill="#93C5FD" fillOpacity="0.8"/>
                  <circle cx="6.5" cy="6.5" r="1.5" fill="white" fillOpacity="0.9"/>
                  <circle cx="17.5" cy="17.5" r="1.5" fill="white" fillOpacity="0.9"/>
                </svg>
              </div>
              <div className="ml-3 hidden sm:block">
                <span className="text-xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                  Los Esmesmeris
                </span>
                <span className="block text-xs font-medium text-blue-400 -mt-1">
                  ERP
                </span>
              </div>
            </Link>
            
            <div className="hidden sm:ml-8 sm:flex sm:space-x-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    'text-slate-300 hover:bg-blue-500/10 hover:text-blue-400',
                    'rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Botón de Login */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <Link href="/login">
              <button className="group relative inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg overflow-hidden shadow-md shadow-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105">
                <LoginIcon sx={{ fontSize: 18 }} className="relative z-10" />
                <span className="relative z-10 hidden sm:inline">Ingresar</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <DisclosurePanel className="sm:hidden border-t border-slate-800/50">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as={Link}
              href={item.href}
              className="text-slate-300 hover:bg-blue-500/10 hover:text-blue-400 block rounded-lg px-3 py-2 text-base font-medium transition-all"
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}


