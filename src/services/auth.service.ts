import { prisma } from "@/lib/prisma";
import { NotFoundException } from "@/utils/app-error";
import { generateInviteCode } from "@/utils/uuid";

export const registerUserServices = async (body:{
    email:string;
    name:string;
    password:string;
}) => {
    const {email, name, password} = body;
    return await prisma.$transaction(async (tx) => {
        try {
            const existingUser = await tx.user.findUnique({where:{email}})
            if(existingUser){
                throw new Error("Email already Exists")
            }
    
            const user = await tx.user.create({data:{name, email, password}});
            
           await tx.account.create({data:{
            user_id:user.user_id,
            provider:'EMAIL',
            provider_id:email
           }})
    
           const workspace = await tx.workspace.create({
            data:{
                name:'My Workspace',
                description:`Workspace created for ${user.name}`,
                owner_id:user.user_id,
                inviteCode:generateInviteCode(),
            }
           })
    
    
           const ownerRole = await tx.role.findUnique({
            where: { name: 'OWNER'}
          });
    
          if(!ownerRole){
            throw new NotFoundException("Owner role not found");
          }
    
         await tx.member.create({
            data:{
                user_id:user.user_id,
                workspace_id:workspace.workspace_id,
                role_id:ownerRole.id,
                joined_at:new Date(),
            }
          });
    
          await tx.user.update({
            where: { user_id: user.user_id },
            data: { current_workspace: workspace.workspace_id }
          });
    
    
          return {user, workspace}
        } catch (error) {
            throw error
        }      
    }) 
}