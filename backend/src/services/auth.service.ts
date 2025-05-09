import { AccountProvider } from "@prisma/client";
import { BadRequestException, NotFoundException } from "../utils/app-error";
import { hashValue } from "../utils/bcrypt";
import { prisma } from "../utils/prisam";
import { generateInviteCode } from "../utils/uuid";
import { Roles } from "../enums/role.enum";

export const registerUserService = async (body: {
  email: string;
  name: string;
  password: string;
}) => {
    const {email, name, password} = body;
    try {
        return prisma.$transaction(async (tx) => {
            
            const existingUser = await tx.user.findFirst({where:{ email }})  
            
            if(existingUser) throw new BadRequestException("Email already exists");

            const hashedPassword = await hashValue(password);

            const user = await tx.user.create({data:{email, name, password:hashedPassword}})

           await tx.account.create({
                data:{
                    user_id:user.user_id,
                    provider:AccountProvider.EMAIL,
                    provider_id:email
                }
            })

            const workspace = await tx.workspace.create({
                data:{
                    name:`My Workspace`, 
                    description:`Workspace created for ${user.name}`,                    
                    owner_id:user.user_id,
                    inviteCode:generateInviteCode()
                }
            })

            const ownerRole = await tx.role.findFirst({where:{name:Roles.OWNER}})

            if(!ownerRole) throw new NotFoundException("Owner role not found");

            await tx.member.create({
                data:{
                    user_id:user.user_id,
                    workspace_id:workspace.workspace_id,
                    role_id:ownerRole.id,
                    joined_at:new Date(),
                }
            })

            return { userId: user.user_id, workspaceId:workspace.workspace_id}
        });
    } catch (error) {
        throw error;
    } 

}   