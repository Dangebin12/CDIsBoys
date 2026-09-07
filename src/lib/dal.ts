import 'server-only'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import type { CodigoPermiso } from './permissions'
import { prisma } from './prisma'
import { leerSesion } from './session'

/** Usuario autenticado con su rol y los códigos de permiso que tiene.
 *  Nunca expone passwordHash. */
export type UsuarioActual = {
  id: string
  email: string
  nombre: string
  rol: { id: string; nombre: string }
  permisos: CodigoPermiso[]
}

/** Fuente única de verdad de la autenticación. `cache` la memoiza dentro de un
 *  mismo render, así varias llamadas no golpean la base repetidas veces. */
export const getUsuarioActual = cache(async (): Promise<UsuarioActual | null> => {
  const sesion = await leerSesion()
  if (!sesion) return null

  const usuario = await prisma.user.findUnique({
    where: { id: sesion.userId },
    select: {
      id: true,
      email: true,
      nombre: true,
      activo: true,
      role: { select: { id: true, nombre: true, permisos: { select: { codigo: true } } } },
    },
  })

  // Un usuario desactivado conserva la cookie pero pierde el acceso.
  if (!usuario || !usuario.activo) return null

  return {
    id: usuario.id,
    email: usuario.email,
    nombre: usuario.nombre,
    rol: { id: usuario.role.id, nombre: usuario.role.nombre },
    permisos: usuario.role.permisos.map((p) => p.codigo as CodigoPermiso),
  }
})

/** Exige sesión válida. Redirige al login si no la hay. */
export async function requerirUsuario(): Promise<UsuarioActual> {
  const usuario = await getUsuarioActual()
  if (!usuario) redirect('/login')
  return usuario
}

/** Exige un permiso concreto. Redirige al dashboard si el rol no lo tiene. */
export async function requerirPermiso(codigo: CodigoPermiso): Promise<UsuarioActual> {
  const usuario = await requerirUsuario()
  if (!usuario.permisos.includes(codigo)) redirect('/dashboard?denegado=' + codigo)
  return usuario
}

export function tienePermiso(usuario: UsuarioActual, codigo: CodigoPermiso) {
  return usuario.permisos.includes(codigo)
}
