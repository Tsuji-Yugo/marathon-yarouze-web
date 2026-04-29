import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import GuestHero from "@/components/GuestHero";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";

// --- 型定義 ---
interface Runner {
  id: number;
  name: string;
  prefecture: string;
  city: string;
  team_type: string;
  background: string;
  running_form: string;
  height: number;
  weight: number;
  speed: number;
  stamina: number;
  vo2_max: number;
  lt_value: number;
  mental: number;
  growth: number;
}

// --- レーダーチャート（SVG）コンポーネント ---
function RadarChart({ runner }: { runner: Runner }) {
  const size = 200; // ラベル表示領域を確保するため少しサイズアップ
  const center = size / 2;
  const radius = size / 3.5; // チャート本体の半径
  const stats = [runner.speed, runner.stamina, runner.vo2_max, runner.lt_value, runner.mental, runner.growth];
  const labels = ["SPD", "STM", "VO2", "LT", "MTL", "GRW"];

  const getPoint = (value: number, index: number, customRadius?: number) => {
    const angle = (Math.PI / 2) - (2 * Math.PI * index) / 6;
    const r = ((customRadius || value) / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center - r * Math.sin(angle),
      angle
    };
  };

  const polygonPoints = stats.map((val, i) => {
    const p = getPoint(val, i);
    return `${p.x},${p.y}`;
  }).join(' ');

  return (
    <div className="flex justify-center items-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* 背景のメモリ線 */}
        {[20, 40, 60, 80, 100].map((level) => (
          <polygon 
            key={level} 
            points={stats.map((_, i) => {
              const p = getPoint(level, i);
              return `${p.x},${p.y}`;
            }).join(' ')} 
            fill="none" 
            stroke="#27272a" 
            strokeWidth="1" 
          />
        ))}
        {/* 軸線 */}
        {stats.map((_, i) => {
          const p = getPoint(100, i);
          return (
            <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="#27272a" strokeWidth="1" />
          );
        })}
        {/* パラメータの塗りつぶし */}
        <polygon points={polygonPoints} fill="rgba(249, 115, 22, 0.4)" stroke="#f97316" strokeWidth="2" />
        
        {/* ★ 各頂点のラベル表示 ★ */}
        {labels.map((label, i) => {
          // ラベルをチャートの少し外側に配置
          const p = getPoint(125, i); 
          return (
            <text
              key={label}
              x={p.x}
              y={p.y}
              fill={i === 5 ? "#a1a1aa" : "#71717a"} // 成長性(GRW)だけ少し色を変えるなどの遊び
              fontSize="10"
              fontWeight="900"
              textAnchor="middle"
              alignmentBaseline="middle"
              className="italic font-mono"
            >
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

async function getRunnersData(email: string): Promise<Runner[]> {
  const res = await fetch(`http://127.0.0.1:3000/api/v1/runners?email=${email}`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export default async function TopPage() {
  const session = await getServerSession(authOptions);
  if (!session) return <div className="bg-zinc-950 min-h-screen"><Navbar /><GuestHero /></div>;

  const runners = await getRunnersData(session.user?.email as string);
  const canCreateMore = runners.length < 3;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20">
      <Navbar />
      <div className="max-w-4xl mx-auto py-12 px-4">
        
        <div className="mb-12 flex justify-between items-end border-b border-zinc-800 pb-6">
          <div>
            <h2 className="text-xl font-black italic uppercase text-orange-500 tracking-tighter">Manage Runners</h2>
            <p className="text-xs text-zinc-500 mt-1 font-bold">最大3名まで登録可能</p>
          </div>
          <div className="text-right font-mono text-sm font-bold text-zinc-700 uppercase">
            Slot: {runners.length} / 3
          </div>
        </div>

        {runners.length > 0 ? (
          <div className="space-y-16">
            {runners.map((runner) => (
              <section key={runner.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <header className="flex justify-between items-start mb-8">
                  <div className="border-l-4 border-orange-600 pl-4">
                    <p className="text-orange-500 font-black italic text-[10px] uppercase tracking-[0.3em] mb-1">Active Runner</p>
                    <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">{runner.name}</h1>
                    <p className="text-zinc-500 font-bold text-sm mt-2">
                      <span className="text-zinc-300">{runner.prefecture} {runner.city}</span>
                      <span className="text-zinc-700 mx-2">/</span>
                      <span className="text-zinc-500 uppercase text-xs tracking-widest">{runner.team_type}</span>
                    </p>
                  </div>
                  {/* 削除ボタンの配置 */}
                  <DeleteButton id={runner.id} runnerName={runner.name} />
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* 六角形パラメータ表示 */}
                  <div className="bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800 shadow-2xl backdrop-blur-sm flex flex-col items-center">
                    <h3 className="text-[10px] font-black text-zinc-600 uppercase mb-2 tracking-widest self-start">Core Parameters</h3>
                    <RadarChart runner={runner} />
                    <div className="grid grid-cols-3 gap-x-4 gap-y-1 mt-4 w-full text-center">
                      {[
                        { label: "SPD", val: runner.speed },
                        { label: "STM", val: runner.stamina },
                        { label: "VO2", val: runner.vo2_max },
                        { label: "LT", val: runner.lt_value },
                        { label: "MTL", val: runner.mental },
                        { label: "GRW", val: runner.growth },
                      ].map(s => (
                        <div key={s.label}>
                          <p className="text-[8px] font-bold text-zinc-600 uppercase">{s.label}</p>
                          <p className="text-xs font-black text-orange-500 italic">{s.val}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-6">
                    <div className="bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800 shadow-2xl grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Physical Status</p>
                        <p className="text-xl font-bold text-zinc-200">
                          {runner.height}<span className="text-[10px] ml-1 text-zinc-500">cm</span> / {runner.weight}<span className="text-[10px] ml-1 text-zinc-500">kg</span>
                        </p>
                        <p className="text-[10px] text-zinc-500 mt-1 uppercase font-mono tracking-tighter">{runner.running_form} / {runner.foot_strike}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Origin</p>
                        <p className="text-lg font-black text-zinc-300 italic leading-tight">{runner.background}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-black py-4 rounded-xl border border-zinc-700 transition-all text-xs uppercase italic tracking-widest active:scale-95">
                        Training
                      </button>
                      <button className="bg-orange-600 hover:bg-orange-500 text-white font-black py-4 rounded-xl shadow-lg shadow-orange-900/40 transition-all text-xs uppercase italic tracking-widest active:scale-95">
                        Race Entry
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            ))}

            {canCreateMore && (
              <div className="pt-10 border-t border-zinc-900 flex justify-center">
                <Link href="/runners/new" className="group flex items-center gap-6 bg-zinc-900/20 hover:bg-zinc-900 border-2 border-dashed border-zinc-800 hover:border-orange-500/50 px-16 py-8 rounded-3xl transition-all duration-500">
                  <div className="text-4xl group-hover:rotate-12 transition-transform duration-500">👟</div>
                  <div className="text-left">
                    <p className="text-[10px] font-black text-zinc-600 group-hover:text-orange-500 uppercase tracking-[0.3em]">Empty Slot</p>
                    <p className="text-xl font-black text-zinc-400 group-hover:text-white tracking-tighter">新しいランナーを登録する</p>
                  </div>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-zinc-900/50 p-16 rounded-[3rem] border-2 border-dashed border-zinc-800 text-center space-y-8 backdrop-blur-sm">
            <div className="text-7xl animate-pulse">🏃‍♂️</div>
            <h2 className="text-3xl font-black tracking-tighter italic uppercase">No Runners Registered</h2>
            <Link href="/runners/new" className="inline-block bg-orange-600 hover:bg-orange-500 px-12 py-5 rounded-2xl font-black text-xl transition-all hover:scale-105 shadow-2xl shadow-orange-900/40 uppercase italic tracking-tighter">Entry Now</Link>
          </div>
        )}
      </div>
    </div>
  );
}