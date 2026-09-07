import Link from 'next/link'
import { requerirUsuario, tienePermiso } from '@/lib/dal'
import { LogoutButton } from './logout-button'
import { Nav, type GrupoNav } from './nav'

export default async function DashboardLayout({ children }: LayoutProps<'/dashboard'>) {
  const usuario = await requerirUsuario()

  // El menú sólo muestra lo que el rol puede abrir; las páginas vuelven a
  // comprobar el permiso, porque ocultar un enlace no protege una ruta.
  const seguridad: GrupoNav['enlaces'] = []
  if (tienePermiso(usuario, 'usuarios.ver')) {
    seguridad.push({ href: '/dashboard/seguridad/usuarios', etiqueta: 'Usuarios' })
  }
  if (tienePermiso(usuario, 'roles.ver')) {
    seguridad.push({ href: '/dashboard/seguridad/roles', etiqueta: 'Roles' })
  }
  if (tienePermiso(usuario, 'permisos.ver')) {
    seguridad.push({ href: '/dashboard/seguridad/permisos', etiqueta: 'Permisos' })
  }

  const grupos: GrupoNav[] = [
    { titulo: 'General', enlaces: [{ href: '/dashboard', etiqueta: 'Inicio' }] },
    ...(seguridad.length ? [{ titulo: 'Seguridad', enlaces: seguridad }] : []),
  ]

  return (
    <div className="flex min-h-full flex-1 bg-slate-50 font-sans dark:bg-slate-950">
      <aside className="flex w-64 shrink-0 flex-col justify-between border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div>
          <Link href="/dashboard" className="mb-8 flex items-center gap-3 px-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-600 text-sm font-bold text-white">
              CDI
            </span>
            <span className="text-sm leading-tight font-semibold text-slate-900 dark:text-white">
              Rescatando Niños
            </span>
          </Link>
          <Nav grupos={grupos} />
        </div>

        <div className="space-y-3 border-t border-slate-200 pt-4 dark:border-slate-800">
          <div className="px-3">
            <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
              {usuario.nombre}
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{usuario.email}</p>
            <p className="mt-1 inline-block rounded bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800 dark:bg-sky-950 dark:text-sky-300">
              {usuario.rol.nombre}
            </p>
          </div>
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 overflow-x-auto p-8">{children}</main>
    </div>
  )
}
