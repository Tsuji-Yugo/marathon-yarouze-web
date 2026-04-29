'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [step, setStep] = useState(1); // 1: 情報入力, 2: OTP入力
  const [formData, setFormData] = useState({ email: '', password: '', nickname: '' });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 手順1: アカウント仮登録 ＆ メール送信
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
      // ▼ ここを変更：Railsからのエラーメッセージを直接アラートで出すようにしました！
      const data = await res.json();
      const errorMessage = data.errors ? data.errors.join("\n") : "原因不明のエラーです";
      alert(`【エラー】\n${errorMessage}`);
    }
  };

  // 手順2: OTP検証 ＆ 登録完了
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("http://127.0.0.1:3000/api/v1/auth/verify", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.email, otp }),
    });
    setLoading(false);
    if (res.ok) {
      alert("登録が完了しました！トップページへ移動します。");
      router.push('/');
    } else {
      alert("認証コードが正しくありません。");
    }
  };

  return (
    <main className="min-h-screen bg-zinc-900 text-zinc-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-800 p-8 rounded-2xl border border-zinc-700 shadow-2xl">
        {step === 1 ? (
          <form onSubmit={handleRegister} className="space-y-6">
            <h1 className="text-3xl font-black text-center text-orange-500 italic">RUNNER REGISTRATION</h1>
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
            <h1 className="text-2xl font-bold">認証コードを入力</h1>
            <p className="text-zinc-400 text-sm">{formData.email} に送られた6桁のコードを入力してください。</p>
            <input required maxLength={6} className="w-full bg-zinc-900 border-2 border-orange-500 rounded-lg p-4 text-center text-3xl font-mono tracking-widest outline-none" 
              value={otp} onChange={e => setOtp(e.target.value)} />
            <button disabled={loading} className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-lg transition-colors">
              {loading ? "検証中..." : "登録を完了する"}
            </button>
            <button type="button" onClick={() => setStep(1)} className="text-zinc-500 text-sm hover:underline">メールアドレスを入力し直す</button>
          </form>
        )}
      </div>
    </main>
  );
}