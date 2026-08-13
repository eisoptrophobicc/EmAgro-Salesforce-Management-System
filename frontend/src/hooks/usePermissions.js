import { useAuth } from "./useAuth";


export function usePermissions() {
  const { user } = useAuth();

  const role = user?.role;

  return {
    role,
    isAdmin: role === "Admin",
    isSubAdmin: role === "Sub Admin",
    canManageUsers: role === "Admin",
    canManageOperations: role === "Sub Admin",
  };
}
