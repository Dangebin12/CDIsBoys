import type { Metadata } from 'next'
import { requerirPermiso } from '@/lib/dal'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = { title: 'Permisos | CDI Rescatando Niños' }

export default async function PermisosPage() {
  await requerirPermiso('permisos.ver')

  const permisos = await prisma.permission.findMany({
    select: {
      id: true,
      codigo: true,
      descripcion: true,
      modulo: true,
      roles: { select: { nombre: true }, orderBy: { nombre: 'asc' } },
    },
    orderBy: [{ modulo: 'asc' }, { codigo: 'asc' }],
  })

  const porModulo = Map.groupBy(permisos, (p) => p.modulo)

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Permisos</h1>
      <p className="mt-1 text-slate-600 dark:text-slate-400">
        Catálogo de acciones que el sistema sabe controlar. Se asignan a través de los roles.
      </p>

      <div className="mt-6 space-y-6">
        {[...porModulo].map(([modulo, lista]) => (
          <section key={modulo}>
            <h2 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              {modulo}
            </h2>
            <ul className="mt-2 divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
              {lista.map((p) => (
                <li key={p.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
                  <code className="font-mono text-sm text-sky-700 dark:text-sky-400">
                    {p.codigo}
                  </code>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {p.descripcion}
                  </span>
                  <span className="ml-auto text-xs text-slate-500 dark:text-slate-500">
                    {p.roles.length ? p.roles.map((r) => r.nombre).join(', ') : 'Sin rol asignado'}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
