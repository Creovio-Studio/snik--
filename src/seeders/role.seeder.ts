import { prisma } from "@/lib/prisma"
import { RolePermissions } from "@/utils/role-permission"
import { Permissions } from "@prisma/client";

export const seedRoles = async () => {
    console.log("----Seeding roles started-----");
  
    return await prisma.$transaction(async (tx) => {
      try {
        await tx.role.deleteMany(); 
  
        for (const roleName in RolePermissions) {
          const role = roleName as keyof typeof RolePermissions;
          const permissions = RolePermissions[role] as Permissions[];  
          console.log(permissions)
          await tx.role.create({
            data: {
              name: role,
              permissions: permissions
            },
          });
        }
  
        console.log("----Seeding roles completed-----");
      } catch (error) {
        console.error("Error during role seeding:", error);
      }
    });
  };

seedRoles();