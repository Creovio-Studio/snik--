import { asyncHandler } from "@/utils/async-handler";
import { registerSchema } from "@/validation/auth.validation";

export const POST = asyncHandler(async (req: Request): Promise<Response> => {
    
    const data = await req.json(); 
    
    const body = registerSchema.parse(data);  
    
    console.log(body);
    
    return new Response(JSON.stringify({ message: "Success", data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  });
  