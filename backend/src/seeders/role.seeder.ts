import { prisma } from "../utils/prisam"
import { RolePermission } from "../utils/role-permission";
import { PermissionsType } from "../enums/role.enum";

(async function seedRoles(){
    console.log("==========Seeding roles started==============");
    return prisma.$transaction(async (tx) => {
        try {
            await tx.role.deleteMany();
            
            for(const rolesName in RolePermission) {
                const role = rolesName as keyof typeof RolePermission;
                const permission = RolePermission[role] as PermissionsType[];                
                console.log(`Role ${role} Permissions ${permission}`)
                
                await tx.role.create({
                    data:{
                        name:role,
                        permissions:permission
                    }
                })
            }
            
            console.log("==========Seeeding Completed==============");
        } catch (error) {
            console.error("Error during seeding", error);
        }
    }) 
})()

