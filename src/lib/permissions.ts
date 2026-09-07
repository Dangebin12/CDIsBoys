// Catálogo de permisos del sistema. El `codigo` es lo que se consulta en el
// código y se guarda en la base de datos; cambiarlo requiere una migración.
export const PERMISOS = [
  { codigo: 'usuarios.ver', descripcion: 'Ver la lista de usuarios', modulo: 'Usuarios' },
  { codigo: 'usuarios.crear', descripcion: 'Crear usuarios nuevos', modulo: 'Usuarios' },
  { codigo: 'usuarios.editar', descripcion: 'Editar usuarios existentes', modulo: 'Usuarios' },
  {
    codigo: 'usuarios.desactivar',
    descripcion: 'Activar y desactivar usuarios',
    modulo: 'Usuarios',
  },
  { codigo: 'roles.ver', descripcion: 'Ver la lista de roles', modulo: 'Roles' },
  { codigo: 'roles.crear', descripcion: 'Crear roles nuevos', modulo: 'Roles' },
  { codigo: 'roles.editar', descripcion: 'Editar roles y sus permisos', modulo: 'Roles' },
  { codigo: 'roles.eliminar', descripcion: 'Eliminar roles', modulo: 'Roles' },
  { codigo: 'permisos.ver', descripcion: 'Ver el catálogo de permisos', modulo: 'Permisos' },
] as const

export type CodigoPermiso = (typeof PERMISOS)[number]['codigo']
