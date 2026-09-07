import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const NOMBRE_COOKIE = 'cdi_session'
const DURACION_MS = 7 * 24 * 60 * 60 * 1000

const secret = process.env.SESSION_SECRET
if (!secret) {
  throw new Error('Falta SESSION_SECRET en el archivo .env')
}
const clave = new TextEncoder().encode(secret)

export type SessionPayload = { userId: string }

/** Sólo el id del usuario: los permisos se leen de la base en cada petición
 *  para que un cambio de rol tenga efecto sin volver a iniciar sesión. */
async function cifrar(payload: SessionPayload, expiraEn: Date) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiraEn)
    .sign(clave)
}

export async function descifrar(token: string | undefined) {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, clave, { algorithms: ['HS256'] })
    return typeof payload.userId === 'string' ? { userId: payload.userId } : null
  } catch {
    return null
  }
}

export async function crearSesion(userId: string) {
  const expiraEn = new Date(Date.now() + DURACION_MS)
  const token = await cifrar({ userId }, expiraEn)
  const cookieStore = await cookies()

  cookieStore.set(NOMBRE_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiraEn,
    path: '/',
  })
}

export async function leerSesion() {
  const cookieStore = await cookies()
  return descifrar(cookieStore.get(NOMBRE_COOKIE)?.value)
}

export async function borrarSesion() {
  const cookieStore = await cookies()
  cookieStore.delete(NOMBRE_COOKIE)
}

export { NOMBRE_COOKIE }
