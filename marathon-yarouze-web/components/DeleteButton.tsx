'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteButton({ id, runnerName }: { id: number, runnerName: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await fetch(`http://127.0.0.1:3000/api/v1/runners/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setIsOpen(false);
      router.refresh();
    } else {
      alert("削除に失敗しました");
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* 削除ボタン本体 */}
      <button 
        onClick={() => setIsOpen(true)}
        className="text-[10px] font-black text-zinc-700 hover:text-red-500 transition-colors uppercase tracking-widest"
      >
        Retire Runner
      </button>

      {/* カスタム確認モーダル */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* 背景のオーバーレイ */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => !isDeleting && setIsOpen(false)}
          />
          
          {/* モーダルコンテンツ */}
          <div className="relative bg-zinc-900 border border-zinc-800 p-8 rounded-3xl max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-6">
              <div className="text-4xl">⚠️</div>
              
              <div>
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">
                  Retire Confirmation
                </h3>
                <p className="text-zinc-500 text-xs mt-2 font-bold leading-relaxed">
                  選手「<span className="text-zinc-200">{runnerName}</span>」を引退させますか？<br />
                  この操作を行うと、これまでの育成データはすべて消去されます。
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-xl shadow-lg shadow-red-900/20 transition-all active:scale-95 uppercase italic tracking-widest text-sm"
                >
                  {isDeleting ? "Processing..." : "Confirm Retirement"}
                </button>
                
                <button
                  onClick={() => setIsOpen(false)}
                  disabled={isDeleting}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-black py-4 rounded-xl transition-all text-xs uppercase tracking-widest"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}