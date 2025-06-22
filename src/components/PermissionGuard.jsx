import { useAdminAccess } from '@/hooks/useAdminAccess'
import AccessDenied from '@/components/AccessDenied'

const PermissionGuard = ({ children, requiredPermission, fallback = null }) => {
  const permissions = useAdminAccess()

  if (!permissions[requiredPermission]) {
    if (fallback) {
      return fallback
    }
    return <AccessDenied />
  }

  return children
}

export default PermissionGuard
