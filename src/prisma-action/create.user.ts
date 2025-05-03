import { hashValue } from "@/utils/bcrypt";
import { Prisma } from "@prisma/client";


export async function createUser(tx:Prisma.TransactionClient, data: { name: string; email: string; password: string }) {
    const hashedPassword = await hashValue(data.password, 10);
    return tx.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      }
    });
}

  