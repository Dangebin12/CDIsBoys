'use server'

import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { crearSesion } from '@/lib/session'

const loginSchema = z.object({
  email: z.email('Ingresa un correo válido.'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.'),
})

export type LoginState = { error?: string }

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const datos = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })
  if (!datos.success) {
    return { error: 'Revisa el correo y la contraseña.' }
  }

  const usuario = await prisma.user.findUnique({
    where: { email: datos.data.email },
    select: { id: true, passwordHash: true, activo: true },
  })

  // Mismo mensaje para usuario inexistente, contraseña mala o cuenta inactiva:
  // así no se puede averiguar qué correos existen probando el formulario.
  const generico = { error: 'Correo o contraseña incorrectos.' }
  if (!usuario || !usuario.activo) {
    // Gasta el mismo tiempo que una comparación real para no delatar por latencia.
    await bcrypt.compare(
      datos.data.password,
      '$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidinv',
    )
    return generico
  }

  const correcta = await bcrypt.compare(datos.data.password, usuario.passwordHash)
  if (!correcta) return generico

  await crearSesion(usuario.id)
  redirect('/dashboard')
}

export async function logout() {
  const { borrarSesion } = await import('@/lib/session')
  await borrarSesion()
  redirect('/login')
}
