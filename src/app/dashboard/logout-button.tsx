'use client'

import { useTransition } from 'react'
import { logout } from '../login/actions'

export function LogoutButton() {
  const [pendiente, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={pendiente}
      onClick={() => startTransition(() => logout())}
      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      {pendiente ? 'Saliendo…' : 'Cerrar sesión'}
    </button>
  )
}
