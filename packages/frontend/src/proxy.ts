import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";



const SSR_API_HOST = process.env.SSR_API_HOST ?? "http://127.0.0.1:3001";

export const config = {
    matcher: [
        "/(api/(?!auth).*)"
    ],
};

export function proxy(request: NextRequest) {
    return NextResponse.rewrite(new URL(request.nextUrl.pathname, SSR_API_HOST));
}

