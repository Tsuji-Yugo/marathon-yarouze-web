import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  // どのような方法でログインさせるかを定義
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Rails バックエンドのログイン API を叩く
        // ※ Rails 側に login アクションを作っていない場合は、今のところ null を返す形になります
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
  // ログイン後のデータをセッションに保存する設定
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    }
  },
  // カスタムログインページなどの指定
  pages: {
    signIn: "/login",
  },
  // セッションの暗号化に使う秘密鍵
  secret: process.env.NEXTAUTH_SECRET,
};