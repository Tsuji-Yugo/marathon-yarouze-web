import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 【重要】将来ここはRailsのAPIを叩く処理に書き換えます！
        // 今回はUIのテストのため、固定のメアドとパスワードでログイン成功とみなします。
        if (credentials?.email === "test@example.com" && credentials?.password === "password") {
          return { id: "1", name: "最凶のランナー", email: "test@example.com" };
        }
        
        // 失敗した場合は null を返す
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login', // 自分で作った /login 画面を使う設定
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };