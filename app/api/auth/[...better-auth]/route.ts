import "server-only";

async function handle(request: Request) {
  const { auth } = await import("@/lib/auth");
  return auth.handler(request);
}

export const GET = handle;
export const POST = handle;
export const PATCH = handle;
export const PUT = handle;
export const DELETE = handle;
