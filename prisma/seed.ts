import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { PERMISOS } from '../src/lib/permissions'

const prisma = new PrismaClient()

const ROLES: Record<string, { descripcion: string; permisos: string[] }> = {
  Administrador: {
    descripcion: 'Acceso total al sistema, incluida el área de seguridad.',
    permisos: PERMISOS.map((p) => p.codigo),
  },
  Coordinador: {
    descripcion: 'Gestiona usuarios del día a día, sin tocar roles ni permisos.',
    permisos: ['usuarios.ver', 'usuarios.crear', 'usuarios.editar', 'roles.ver'],
  },
  Consulta: {
    descripcion: 'Sólo lectura. No puede modificar nada.',
    permisos: ['usuarios.ver', 'roles.ver', 'permisos.ver'],
  },
}

function requerido(nombre: string): string {
  const valor = process.env[nombre]
  if (!valor) throw new Error(`Falta ${nombre} en el archivo .env`)
  return valor
}

const ADMIN_EMAIL = requerido('ADMIN_EMAIL')
const ADMIN_PASSWORD = requerido('ADMIN_PASSWORD')
const ADMIN_NOMBRE = process.env.ADMIN_NOMBRE ?? 'Administrador'

async function main() {
  for (const permiso of PERMISOS) {
    await prisma.permission.upsert({
      where: { codigo: permiso.codigo },
      update: { descripcion: permiso.descripcion, modulo: permiso.modulo },
      create: { ...permiso },
    })
  }

  for (const [nombre, { descripcion, permisos }] of Object.entries(ROLES)) {
    await prisma.role.upsert({
      where: { nombre },
      update: { descripcion, permisos: { set: permisos.map((codigo) => ({ codigo })) } },
      create: {
        nombre,
        descripcion,
        esSistema: nombre === 'Administrador',
        permisos: { connect: permisos.map((codigo) => ({ codigo })) },
      },
    })
  }

  const rolAdmin = await prisma.role.findUniqueOrThrow({ where: { nombre: 'Administrador' } })
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      nombre: ADMIN_NOMBRE,
      passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 10),
      roleId: rolAdmin.id,
      activo: true,
    },
    create: {
      email: ADMIN_EMAIL,
      nombre: ADMIN_NOMBRE,
      passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 10),
      roleId: rolAdmin.id,
    },
  })

  console.log(`Listo. Administrador: ${ADMIN_EMAIL} (contraseña en .env)`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
