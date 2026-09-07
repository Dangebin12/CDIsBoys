import type { Metadata } from 'next'
import { requerirPermiso } from '@/lib/dal'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = { title: 'Usuarios | CDI Rescatando Niños' }

export default async function UsuariosPage() {
  await requerirPermiso('usuarios.ver')

  const usuarios = await prisma.user.findMany({
    select: {
      id: true,
      nombre: true,
      email: true,
      activo: true,
      creadoEn: true,
      role: { select: { nombre: true } },
    },
    orderBy: { creadoEn: 'asc' },
  })

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Usuarios</h1>
      <p className="mt-1 text-slate-600 dark:text-slate-400">
        Personas con acceso al sistema y el rol que tiene cada una.
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">
                Nombre
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Correo
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Rol
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{u.nombre}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{u.email}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{u.role.nombre}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-medium ${
                      u.activo
                        ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                        : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {u.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
