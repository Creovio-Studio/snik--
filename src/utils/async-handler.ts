export type AsyncHandler = (req: Request) => Promise<Response>;

export const asyncHandler = (handler: AsyncHandler): AsyncHandler => {
  return async (req: Request): Promise<Response> => {
    try {
      return await handler(req);
    } catch (error) {
      console.error("Unhandled Error:", error);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  };
};