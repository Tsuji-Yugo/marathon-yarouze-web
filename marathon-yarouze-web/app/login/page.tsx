"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // NextAuthのsignIn関数を呼び出す
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // 自分でリダイレクト制御するためにfalse
    });

    if (result?.error) {
      setError("メールアドレスかパスワードが間違っています。");
    } else {
      // 成功したらダッシュボード（マイページ）へ遷移
      router.push("/dashboard");
    }
  };

  return (
    <main className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
      <div className="bg-zinc-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-zinc-700">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">ログイン</h2>
        
        {/* エラーメッセージの表示エリア */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded mb-4 text-sm font-bold">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-zinc-400 text-sm font-bold mb-2">メールアドレス</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded bg-zinc-900 border border-zinc-600 text-white focus:outline-none focus:border-red-500"
              placeholder="test@example.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-zinc-400 text-sm font-bold mb-2">パスワード</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded bg-zinc-900 border border-zinc-600 text-white focus:outline-none focus:border-red-500"
              placeholder="password"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded transition-colors"
          >
            ログインして走る
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-zinc-400 hover:text-white text-sm transition-colors">
            ← トップページに戻る
          </Link>
        </div>
      </div>
    </main>
  );
}