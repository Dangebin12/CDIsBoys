import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-sky-50 to-white px-6 py-20 text-center font-sans dark:from-slate-950 dark:to-slate-900">
      <span
        aria-hidden
        className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-sky-600 text-3xl font-bold text-white shadow-lg shadow-sky-600/30"
      >
        CDI
      </span>

      <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl dark:text-white">
        CDI Rescatando Niños
      </h1>

      <p className="mt-6 max-w-xl text-lg text-slate-600 dark:text-slate-300">
        Plataforma de gestión del centro. Acompañamos, protegemos y damos seguimiento a cada niño
        bajo nuestro cuidado.
      </p>

      <Link
        href="/login"
        className="mt-10 rounded-lg bg-sky-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
      >
        Iniciar sesión
      </Link>

      <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
        Acceso exclusivo para personal autorizado.
      </p>
    </main>
  )
}
