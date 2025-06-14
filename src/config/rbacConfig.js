export const roles = {
  CLIENT: 'CLIENT',
  ADMIN: 'ADMIN'
}

export const permissions = {
  VIEW_CLIENT: 'VIEW_CLIENT',
  VIEW_ADMIN: 'VIEW_ADMIN'
}

export const rolePermissions = {
  [roles.CLIENT]: [permissions.VIEW_CLIENT],
  [roles.ADMIN]: [permissions.VIEW_ADMIN]
}
