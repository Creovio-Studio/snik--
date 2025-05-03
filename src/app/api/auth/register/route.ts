import { HTTPSTATUS } from "@/config/http.config";
import { registerUserServices } from "@/services/auth.service";
import { asyncHandler } from "@/utils/async-handler";
import { registerSchema } from "@/validation/auth.validation";

export const POST = asyncHandler(async (req: Request): Promise<Response> => {
    
    const data = await req.json(); 
    
    const body = registerSchema.parse(data);  
    
    await registerUserServices(body);
    
    return new Response(JSON.stringify({ message: "user created sucessfully", data }), {
      status: HTTPSTATUS.CREATED,
      headers: { "Content-Type": "application/json" },
    });
  });
  