'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react'; // ✅ signIn を追加
import Link from 'next/link';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ email: '', password: '', nickname: '' });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("http://127.0.0.1:3000/api/v1/auth/register", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setLoading(false);
    if (res.ok) {
      setStep(2);
    } else {
      const data = await res.json();
      alert(`【エラー】\n${data.errors?.join("\n") || "登録に失敗しました"}`);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // 1. まず認証コードを検証
    const res = await fetch("http://127.0.0.1:3000/api/v1/auth/verify", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.email, otp }),
    });

    if (res.ok) {
      // ✅ 2. 認証に成功したら、そのまま signIn を呼び出して自動ログインさせる
      const loginRes = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false, // 画面遷移はボタンを押した時に自分で行うので false
      });

      setLoading(false);
      if (loginRes?.ok) {
        setIsRegistered(true); // 登録完了画面へ切り替え
      } else {
        alert("アカウントは有効化されましたが、ログインに失敗しました。トップからログインしてください。");
        router.push("/login");
      }
    } else {
      setLoading(false);
      alert("認証コードが正しくありません。");
    }
  };

  if (isRegistered) {
    return (
      <main className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
        <div className="bg-zinc-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-zinc-700 text-center animate-in fade-in zoom-in duration-500">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-black text-orange-500 italic mb-4">登録完了！</h2>
          <p className="text-zinc-300 mb-8 font-bold text-sm leading-relaxed">
            ランナー登録が完了しました。<br />
            いよいよ、あなたの過酷で熱いマラソン人生が始まります。
          </p>
          <button 
            onClick={() => {
              // ログイン状態を確実に反映させるためにリフレッシュしてからトップへ
              router.push("/");
              router.refresh();
            }}
            className="block w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-4 rounded shadow-lg shadow-orange-900/20 transition-all active:scale-95"
          >
            トップページへ向かう
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-900 text-zinc-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-800 p-8 rounded-2xl border border-zinc-700 shadow-2xl">
        {step === 1 ? (
          <form onSubmit={handleRegister} className="space-y-6">
            <h1 className="text-3xl font-black text-center text-orange-500 italic">マラソンやろうぜ！</h1>
            <p className="text-center text-zinc-400 font-bold -mt-4">新規ランナー登録</p>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">ニックネーム</label>
              <input required className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 outline-none focus:border-orange-500" 
                onChange={e => setFormData({...formData, nickname: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">メールアドレス</label>
              <input type="email" required className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 outline-none focus:border-orange-500" 
                onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">パスワード</label>
              <input type="password" required className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 outline-none focus:border-orange-500" 
                onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>
            <button disabled={loading} className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-lg transition-colors shadow-lg shadow-orange-900/20">
              {loading ? "送信中..." : "認証メールを送信"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6 text-center">
            <h1 className="text-2xl font-bold italic text-orange-500">認証コードを入力</h1>
            <p className="text-zinc-400 text-sm">{formData.email} に送られた6桁のコードを入力してください。</p>
            <input required maxLength={6} className="w-full bg-zinc-900 border-2 border-orange-500 rounded-lg p-4 text-center text-3xl font-mono tracking-widest outline-none" 
              value={otp} onChange={e => setOtp(e.target.value)} />
            <button disabled={loading} className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-lg transition-colors">
              {loading ? "検証中..." : "登録を完了して走り出す！"}
            </button>
            <button type="button" onClick={() => setStep(1)} className="text-zinc-500 text-sm hover:underline">メールアドレスを入力し直す</button>
          </form>
        )}
      </div>
    </main>
  );
}