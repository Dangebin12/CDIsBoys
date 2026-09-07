import type { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from './login-form'

export const metadata: Metadata = {
  title: 'Iniciar sesión | CDI Rescatando Niños',
}

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-slate-50 px-6 py-16 font-sans dark:bg-slate-950">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link
            href="/"
            aria-label="Volver al inicio"
            className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-sky-600 text-xl font-bold text-white"
          >
            CDI
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Iniciar sesión</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Ingresa tus credenciales para continuar.
          </p>
        </div>

        <LoginForm />

        <p className="mt-6 text-center text-sm">
          <Link href="/" className="text-sky-700 hover:underline dark:text-sky-400">
            Volver al inicio
          </Link>
        </p>
      </div>
    </main>
  )
}
