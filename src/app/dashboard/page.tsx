import type { Metadata } from 'next'
import Link from 'next/link'
import { requerirUsuario, tienePermiso } from '@/lib/dal'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = { title: 'Inicio | CDI Rescatando Niños' }

export default async function DashboardPage({ searchParams }: PageProps<'/dashboard'>) {
  const usuario = await requerirUsuario()
  const { denegado } = await searchParams

  // Cada tarjeta se muestra sólo si el rol puede abrir esa pantalla; si no,
  // el usuario vería un enlace que lo devuelve con un aviso de denegado.
  const verUsuarios = tienePermiso(usuario, 'usuarios.ver')
  const verRoles = tienePermiso(usuario, 'roles.ver')
  const verPermisos = tienePermiso(usuario, 'permisos.ver')
  const puedeVerSeguridad = verUsuarios || verRoles || verPermisos

  const [usuarios, roles, permisos] = await Promise.all([
    verUsuarios ? prisma.user.count() : null,
    verRoles ? prisma.role.count() : null,
    verPermisos ? prisma.permission.count() : null,
  ])

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        Hola, {usuario.nombre.split(' ')[0]}
      </h1>
      <p className="mt-1 text-slate-600 dark:text-slate-400">
        Estás dentro del sistema con el rol <strong>{usuario.rol.nombre}</strong>.
      </p>

      {typeof denegado === 'string' && (
        <p
          role="alert"
          className="mt-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200"
        >
          Tu rol no tiene el permiso <code className="font-mono">{denegado}</code>, así que no
          puedes abrir esa sección.
        </p>
      )}

      {puedeVerSeguridad ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {verUsuarios && (
            <Tarjeta titulo="Usuarios" valor={usuarios} href="/dashboard/seguridad/usuarios" />
          )}
          {verRoles && <Tarjeta titulo="Roles" valor={roles} href="/dashboard/seguridad/roles" />}
          {verPermisos && (
            <Tarjeta titulo="Permisos" valor={permisos} href="/dashboard/seguridad/permisos" />
          )}
        </div>
      ) : (
        <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">
          Tu rol no tiene acceso al área de seguridad.
        </p>
      )}
    </div>
  )
}

function Tarjeta({ titulo, valor, href }: { titulo: string; valor: number | null; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-sky-500 dark:border-slate-800 dark:bg-slate-900"
    >
      <p className="text-sm text-slate-500 dark:text-slate-400">{titulo}</p>
      <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">{valor ?? '—'}</p>
    </Link>
  )
}
