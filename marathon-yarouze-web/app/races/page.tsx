'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';

interface Marathon {
  id: number;
  name: string;
  location: string;
  region: string;
  description: string;
  elevation_gain: number;
  difficulty: number;
  characteristic: 'FLAT' | 'HILLY' | 'HOT';
}

const REGIONS = ["ALL", "北海道", "東北", "関東", "中部", "近畿", "中国・四国", "九州・沖縄", "海外"];

export default function RaceEntryPage() {
  const [marathons, setMarathons] = useState<Marathon[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeRegion, setActiveRegion] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("http://127.0.0.1:3000/api/v1/marathons")
      .then(res => res.json())
      .then(data => {
        // もしデータがちゃんとした配列ならセットする、違ったら空っぽにする
        if (Array.isArray(data)) {
          setMarathons(data);
        } else {
          console.error("大会データの取得に失敗しました:", data);
          setMarathons([]);
        }
      })
      .catch(err => {
        console.error("通信エラー:", err);
        setMarathons([]);
      });
  }, []);

  // フィルタリングロジック（Array.isArrayで安全網を追加！）
  const safeMarathons = Array.isArray(marathons) ? marathons : [];
  const filteredMarathons = safeMarathons.filter(m => {
    const matchesRegion = activeRegion === "ALL" || m.region === activeRegion;
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  const selectedRace = safeMarathons.find(m => m.id === selectedId);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-12 px-4">
        <header className="mb-10">
          <h1 className="text-4xl font-black italic uppercase text-orange-500 tracking-tighter">Race Selection</h1>
          <p className="text-zinc-500 font-bold mt-2 text-sm uppercase tracking-widest">次なる戦いの舞台を選べ</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* 左サイド：フィルタパネル */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-xs font-black text-zinc-600 uppercase tracking-widest">Search</h3>
              <input 
                type="text"
                placeholder="大会名・開催地で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-black text-zinc-600 uppercase tracking-widest mb-4">Region</h3>
              {REGIONS.map(region => (
                <button
                  key={region}
                  onClick={() => setActiveRegion(region)}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    activeRegion === region 
                    ? "bg-orange-600 text-white shadow-lg shadow-orange-900/20" 
                    : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* 中央：大会リスト */}
          <div className="lg:col-span-2 space-y-4">
            <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em] mb-2">
              Showing {filteredMarathons.length} Marathons
            </p>
            {filteredMarathons.map(m => (
              <div 
                key={m.id}
                onClick={() => setSelectedId(m.id)}
                className={`group p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  selectedId === m.id 
                  ? 'border-orange-500 bg-orange-500/5' 
                  : 'border-zinc-900 bg-zinc-900/30 hover:border-zinc-800'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-black bg-zinc-800 px-2 py-0.5 rounded text-zinc-500 uppercase">{m.region}</span>
                      <h2 className="text-xl font-black italic uppercase tracking-tight group-hover:text-orange-400 transition-colors">{m.name}</h2>
                    </div>
                    <p className="text-xs text-zinc-600 font-bold">{m.location}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-[10px] font-black px-2 py-1 rounded ${
                      m.characteristic === 'FLAT' ? 'text-blue-400 bg-blue-400/10' :
                      m.characteristic === 'HILLY' ? 'text-green-400 bg-green-400/10' :
                      'text-red-400 bg-red-400/10'
                    }`}>
                      {m.characteristic}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 右サイド：詳細分析・エントリー */}
          <div className="lg:col-span-1">
            {selectedRace ? (
              <div className="sticky top-24 bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem] shadow-2xl space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest border-b border-zinc-800 pb-3">Course Analysis</h3>
                  
                  <div className="space-y-2">
                    <p className="text-2xl font-black italic uppercase tracking-tighter">{selectedRace.name}</p>
                    <p className="text-sm text-zinc-400 leading-relaxed font-bold">{selectedRace.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800/50">
                      <p className="text-[10px] font-bold text-zinc-600 uppercase mb-1 tracking-tighter">獲得標高</p>
                      <p className="text-xl font-black text-zinc-200 italic">{selectedRace.elevation_gain}<span className="text-xs ml-1">m</span></p>
                    </div>
                    <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800/50">
                      <p className="text-[10px] font-bold text-zinc-600 uppercase mb-1 tracking-tighter">難易度</p>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className={`w-1.5 h-3 rounded-full ${i < selectedRace.difficulty ? 'bg-orange-500' : 'bg-zinc-800'}`} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/20">
                    <p className="text-[10px] font-bold text-orange-500/60 uppercase mb-2">推奨パラメータ</p>
                    <div className="flex gap-2">
                      {selectedRace.characteristic === 'FLAT' && ["SPD", "LT", "GRW"].map(t => <span key={t} className="text-xs font-black text-orange-400 bg-orange-400/10 px-2 py-1 rounded">{t}</span>)}
                      {selectedRace.characteristic === 'HILLY' && ["STM", "VO2", "MTL"].map(t => <span key={t} className="text-xs font-black text-green-400 bg-green-400/10 px-2 py-1 rounded">{t}</span>)}
                      {selectedRace.characteristic === 'HOT' && ["MTL", "STM", "VO2"].map(t => <span key={t} className="text-xs font-black text-red-400 bg-red-400/10 px-2 py-1 rounded">{t}</span>)}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => router.push(`/races/start?id=${selectedRace.id}`)}
                  className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-orange-900/40 transition-all active:scale-95 text-xl italic uppercase tracking-tighter"
                >
                  Confirm Entry
                </button>
              </div>
            ) : (
              <div className="h-64 border-2 border-dashed border-zinc-900 rounded-[2rem] flex flex-col items-center justify-center text-zinc-700 p-8 text-center space-y-4">
                <div className="text-4xl opacity-20">🚩</div>
                <p className="font-bold italic uppercase tracking-widest text-xs">Select a race to<br />view course details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}