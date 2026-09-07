'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export type EnlaceNav = { href: string; etiqueta: string }
export type GrupoNav = { titulo: string; enlaces: EnlaceNav[] }

export function Nav({ grupos }: { grupos: GrupoNav[] }) {
  const pathname = usePathname()

  return (
    <nav className="space-y-6">
      {grupos.map((grupo) => (
        <div key={grupo.titulo}>
          <p className="px-3 text-xs font-semibold tracking-wider text-slate-400 uppercase">
            {grupo.titulo}
          </p>
          <ul className="mt-2 space-y-1">
            {grupo.enlaces.map((enlace) => {
              const activo = pathname === enlace.href
              return (
                <li key={enlace.href}>
                  <Link
                    href={enlace.href}
                    aria-current={activo ? 'page' : undefined}
                    className={`block rounded-lg px-3 py-2 text-sm transition ${
                      activo
                        ? 'bg-sky-600 font-medium text-white'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    {enlace.etiqueta}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
