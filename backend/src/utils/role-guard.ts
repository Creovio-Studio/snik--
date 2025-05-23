import {PermissionsType} from "../enums/role.enum"
import { UnauthorizedException } from "./app-error"
import { RolePermission } from "./role-permission"

export const roleGuard = (role:keyof typeof RolePermission, requiredPermissions:PermissionsType[]) => {
    const permissions = RolePermission[role];

    const hasPermission = requiredPermissions.every((permission) => permissions.includes(permission));
    
    if(!hasPermission) throw new UnauthorizedException("You do not have the necessary permisions to perform this action");
}