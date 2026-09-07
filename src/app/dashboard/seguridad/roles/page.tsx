import type { Metadata } from 'next'
import { requerirPermiso } from '@/lib/dal'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = { title: 'Roles | CDI Rescatando Niños' }

export default async function RolesPage() {
  await requerirPermiso('roles.ver')

  const roles = await prisma.role.findMany({
    select: {
      id: true,
      nombre: true,
      descripcion: true,
      esSistema: true,
      permisos: { select: { codigo: true }, orderBy: { codigo: 'asc' } },
      _count: { select: { usuarios: true } },
    },
    orderBy: { nombre: 'asc' },
  })

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Roles</h1>
      <p className="mt-1 text-slate-600 dark:text-slate-400">
        Cada rol agrupa un conjunto de permisos. Un usuario tiene exactamente un rol.
      </p>

      <ul className="mt-6 space-y-4">
        {roles.map((rol) => (
          <li
            key={rol.id}
            className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-semibold text-slate-900 dark:text-white">{rol.nombre}</h2>
              {rol.esSistema && (
                <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  Del sistema
                </span>
              )}
              <span className="ml-auto text-sm text-slate-500 dark:text-slate-400">
                {rol._count.usuarios} usuario{rol._count.usuarios === 1 ? '' : 's'}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{rol.descripcion}</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {rol.permisos.map((p) => (
                <li
                  key={p.codigo}
                  className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  {p.codigo}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}
