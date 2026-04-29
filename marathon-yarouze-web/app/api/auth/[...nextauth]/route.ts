// app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

// GETとPOSTの両方のリクエストをNextAuthが処理できるようにエクスポート
export { handler as GET, handler as POST };