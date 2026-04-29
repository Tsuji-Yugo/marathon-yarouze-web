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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // NextAuthのsignIn関数を呼び出す
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // 自分でリダイレクト制御するためにfalse
    });

    if (result?.error) {
      setError("メールアドレスかパスワードが間違っています。");
      setLoading(false);
    } else {
      // ✅ 成功したらトップページ（/）へ遷移
      // page.tsxのロジックにより、ログイン後は自動的にダッシュボード画面が表示されます
      router.push("/");
      router.refresh(); // セッション情報を確実に反映させるためにリフレッシュ
    }
  };

  return (
    <main className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
      <div className="bg-zinc-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-zinc-700">
        <div className="text-center mb-8">
          <h1 className="text-orange-500 font-black text-2xl italic mb-2">マラソンやろうぜ！</h1>
          <h2 className="text-3xl font-bold text-white">ログイン</h2>
        </div>
        
        {/* エラーメッセージの表示エリア */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded mb-4 text-sm font-bold animate-pulse">
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
              className="w-full p-3 rounded bg-zinc-900 border border-zinc-600 text-white focus:outline-none focus:border-orange-500 transition-colors"
              placeholder="runner@example.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-zinc-400 text-sm font-bold mb-2">パスワード</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded bg-zinc-900 border border-zinc-600 text-white focus:outline-none focus:border-orange-500 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded shadow-lg shadow-orange-900/20 transition-all active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? "準備中..." : "ログインして走り出す！"}
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <p className="text-zinc-500 text-sm">
            アカウントを持っていない？{" "}
            <Link href="/register" className="text-orange-500 hover:underline font-bold">
              今すぐエントリー
            </Link>
          </p>
          <hr className="border-zinc-700" />
          <Link href="/" className="inline-block text-zinc-400 hover:text-white text-sm transition-colors">
            ← トップページに戻る
          </Link>
        </div>
      </div>
    </main>
  );
}