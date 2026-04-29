// app/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // authOptionsのパスは適宜調整してください
import Navbar from "@/components/Navbar";
import GuestHero from "@/components/GuestHero";

async function getRunnerData(email: string) {
  // 本来はログインユーザーのemailをRailsに送り、その人のデータを取得します
  const res = await fetch(`http://127.0.0.1:3000/api/v1/runners?email=${email}`, { cache: 'no-store' });
  if (!res.ok) return null;
  const data = await res.json();
  return data[0]; // 配列で返ってくる想定
}

export default async function TopPage() {
  const session = await getServerSession(authOptions);

  // 1. 未ログインの場合
  if (!session) {
    return (
      <main className="min-h-screen bg-zinc-900 text-zinc-100">
        <Navbar />
        <GuestHero />
      </main>
    );
  }

  // 2. ログイン済みの場合
  const runner = await getRunnerData(session.user?.email || "");

  return (
    <main className="min-h-screen bg-zinc-900 text-zinc-100 pb-20">
      <Navbar />
      
      <div className="max-w-4xl mx-auto space-y-10 p-8">
        {!runner ? (
          <div className="bg-zinc-800 p-10 rounded-xl border border-dashed border-zinc-700 text-center">
            <p className="mb-4">選手データがまだ作成されていません。</p>
            <button className="bg-orange-600 px-6 py-2 rounded-lg font-bold">キャラを作成する</button>
          </div>
        ) : (
          <>
            {/* 現在のステータス（ユーザーの既存コードを活用） */}
            <section>
              <h1 className="text-2xl font-bold mb-4 text-zinc-300 italic uppercase">Current Status</h1>
              <div className="bg-zinc-800 p-6 rounded-xl border border-zinc-700 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl font-black italic">RANK C</div>
                <div className="flex items-end gap-4 mb-6 relative">
                  <p className="text-4xl font-extrabold text-orange-500">{runner.name}</p>
                  <p className="text-zinc-400 text-lg mb-1">{runner.age}歳</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
                  <StatCard label="VO2 Max" value={runner.vo2_max} color="border-orange-500" />
                  <StatCard label="LT値" value={runner.lt_value} color="border-blue-500" />
                  <StatCard label="スピード" value={runner.speed || '---'} color="border-green-500" />
                  <StatCard label="耐久力" value={runner.durability} color="border-red-500" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                   <div className="text-center p-2 bg-zinc-900/50 rounded">
                     <p className="text-zinc-500 text-xs">レースまで</p>
                     <p className="font-bold">あと {runner.days_to_race} 日</p>
                   </div>
                   <div className="text-center p-2 bg-zinc-900/50 rounded">
                     <p className="text-zinc-500 text-xs">所持金</p>
                     <p className="font-bold text-yellow-500">¥{runner.funds?.toLocaleString()}</p>
                   </div>
                </div>
              </div>
            </section>

            {/* 行動メニュー */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-zinc-300 italic uppercase">Next Action</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ActionButton emoji="🏆" title="大会に出場" desc="賞金と名声を獲得" color="border-orange-600" hover="hover:bg-orange-600" />
                <ActionButton emoji="🏃‍♂️" title="トレーニング" desc="パラメータを強化" color="border-blue-600" hover="hover:bg-blue-600" />
                <ActionButton emoji="💼" title="仕事をする" desc="活動資金を稼ぐ" color="border-green-600" hover="hover:bg-green-600" />
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

// 小さな部品（コンポーネント化してスッキリさせる）
function StatCard({ label, value, color }: { label: string, value: any, color: string }) {
  return (
    <div className={`bg-zinc-900 p-4 rounded border-l-4 ${color}`}>
      <p className="text-zinc-400 text-xs uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function ActionButton({ emoji, title, desc, color, hover }: { emoji: string, title: string, desc: string, color: string, hover: string }) {
  return (
    <button className={`group relative bg-zinc-800 p-8 rounded-xl border-2 ${color} ${hover} transition-all duration-200 text-left shadow-lg overflow-hidden`}>
      <p className="text-4xl mb-4 group-hover:scale-110 transition-transform">{emoji}</p>
      <p className="text-2xl font-bold text-white mb-2">{title}</p>
      <p className="text-sm text-zinc-400 group-hover:text-white/80">{desc}</p>
    </button>
  );
}