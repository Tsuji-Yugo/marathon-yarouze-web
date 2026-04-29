'use client'

import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  // ログインしていない時はロゴだけ表示
  if (!session) {
    return (
      <nav className="bg-zinc-900 border-b border-zinc-800 p-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-orange-500 font-black text-xl italic">マラソンやろうぜ</Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-zinc-900 border-b border-zinc-800 p-4 sticky top-0 z-50">
      {/* ▼ 変更点1：max-w-4xl を外して w-full に変更 ▼ */}
      <div className="w-full px-2 md:px-6 mx-auto flex justify-between items-center">
        <Link href="/" className="text-orange-500 font-black text-xl italic">
          マラソンやろうぜ
        </Link>

        {/* ハンバーガーボタン */}
        <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
          <div className="space-y-1.5">
            <span className={`block w-6 h-0.5 bg-white transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all ${isOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </div>
        </button>
      </div>

      {/* ドロップダウンメニュー */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-zinc-800 border-b border-zinc-700 shadow-2xl animate-in slide-in-from-top-1">
          {/* ▼ 変更点2：メニューの中身も max-w-4xl を w-full に合わせて変更 ▼ */}
          <div className="w-full px-6 md:px-10 mx-auto flex flex-col p-4">
            <p className="text-zinc-500 text-xs mb-4 px-2">LOGIN AS: {session.user?.email}</p>
            <Link href="/" onClick={() => setIsOpen(false)} className="p-3 text-zinc-100 hover:bg-zinc-700 rounded-lg">ダッシュボード</Link>
            <Link href="/training" onClick={() => setIsOpen(false)} className="p-3 text-zinc-100 hover:bg-zinc-700 rounded-lg">トレーニング記録</Link>
            <hr className="border-zinc-700 my-2" />
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="p-3 text-left text-red-500 hover:bg-zinc-700 rounded-lg font-bold"
            >
              ログアウト
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}