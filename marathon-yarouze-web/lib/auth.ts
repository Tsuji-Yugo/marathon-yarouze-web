import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  // 1. ログインプロバイダーの設定
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const res = await fetch("http://127.0.0.1:3000/api/v1/auth/login", {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" }
          });
          
          const user = await res.json();

          if (res.ok && user) {
            return user;
          }
        } catch (error) {
          console.error("Login error:", error);
        }
        return null;
      }
    })
  ],

  // 2. ログイン後のデータ処理（管理者判定を追加）
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
        // 特定のメールアドレスなら管理者フラグを立てる
        // @ts-ignore
        token.isAdmin = user.email === "marathon.yarouze@gmail.com";
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any;
      // セッションにも管理者情報を引き継ぐ
      if (session.user) {
        // @ts-ignore
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    }
  },

  // 3. 各種設定
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};