'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

// --- データ定義 ---
const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
  "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
  "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
];

type BackgroundKey = 'DIET' | 'MULTI_ATHLETE' | 'HAKONE_REGRET' | 'LATE_BLOOMER' | 'SCIENCE_RUNNER';

// バックボーンごとの初期ベースステータス（100点満点）
const BACKGROUNDS: Record<BackgroundKey, { label: string, desc: string, baseStats: number[] }> = {
  DIET: {
    label: "健康・ダイエット目的", desc: "運動不足解消から始めた市民ランナーの鏡。",
    baseStats: [20, 30, 20, 20, 40, 95] // [スピード, スタミナ, VO2Max, LT値, メンタル, 成長性]
  },
  MULTI_ATHLETE: {
    label: "元・他競技アスリート", desc: "サッカーや野球で培った基礎体力を持つ。",
    baseStats: [60, 70, 60, 40, 60, 50]
  },
  HAKONE_REGRET: {
    label: "箱根の挫折", desc: "エリート街道を歩むも、怪我や挫折を経験。",
    baseStats: [85, 70, 80, 80, 30, 40]
  },
  LATE_BLOOMER: {
    label: "遅咲きの才能", desc: "社会人になってから走る喜びに目覚めた。",
    baseStats: [40, 60, 50, 50, 70, 80]
  },
  SCIENCE_RUNNER: {
    label: "データ重視派", desc: "最新理論とガジェットを駆使する頭脳派。",
    baseStats: [50, 60, 60, 75, 80, 60]
  }
};

const STAT_LABELS = ["スピード", "スタミナ", "VO2Max", "LT値", "メンタル", "成長性"];

// --- SVGレーダーチャートコンポーネント ---
function RadarChart({ stats }: { stats: number[] }) {
  const size = 200;
  const center = size / 2;
  const radius = size / 2.5;

  // ポイントの座標を計算する関数
  const getPoint = (value: number, index: number) => {
    const angle = (Math.PI / 2) - (2 * Math.PI * index) / 6;
    const r = (value / 100) * radius;
    return `${center + r * Math.cos(angle)},${center - r * Math.sin(angle)}`;
  };

  const polygonPoints = stats.map((val, i) => getPoint(val, i)).join(' ');
  const maxPolygonPoints = stats.map((_, i) => getPoint(100, i)).join(' ');

  return (
    <div className="relative flex justify-center items-center w-full max-w-[280px] mx-auto">
      <svg width={size} height={size} className="overflow-visible">
        {/* 背景の六角形（メモリ） */}
        {[20, 40, 60, 80, 100].map((level) => (
          <polygon key={level} points={stats.map((_, i) => getPoint(level, i)).join(' ')} fill="none" stroke="#3f3f46" strokeWidth="1" />
        ))}
        {/* 軸線 */}
        {stats.map((_, i) => (
          <line key={i} x1={center} y1={center} x2={getPoint(100, i).split(',')[0]} y2={getPoint(100, i).split(',')[1]} stroke="#3f3f46" strokeWidth="1" />
        ))}
        {/* パラメータの六角形 */}
        <polygon points={polygonPoints} fill="rgba(249, 115, 22, 0.4)" stroke="#f97316" strokeWidth="2" className="transition-all duration-500 ease-out" />
        {/* 各頂点のドット */}
        {stats.map((val, i) => {
          const [x, y] = getPoint(val, i).split(',');
          return <circle key={i} cx={x} cy={y} r="4" fill="#f97316" className="transition-all duration-500 ease-out" />;
        })}
      </svg>
      {/* ラベル配置 */}
      {stats.map((val, i) => {
        const angle = (Math.PI / 2) - (2 * Math.PI * i) / 6;
        // ラベルを少し外側に配置
        const labelR = radius + 25; 
        const x = center + labelR * Math.cos(angle) - 10;
        const y = center - labelR * Math.sin(angle) - 10;
        
        let positionClass = "absolute text-xs font-bold w-16 text-center ";
        if (i === 0) positionClass += "-top-4 left-1/2 -translate-x-1/2"; // スピード
        else if (i === 1) positionClass += "top-10 -right-6"; // スタミナ
        else if (i === 2) positionClass += "bottom-4 -right-6"; // VO2Max
        else if (i === 3) positionClass += "-bottom-6 left-1/2 -translate-x-1/2"; // LT値
        else if (i === 4) positionClass += "bottom-4 -left-6"; // メンタル
        else if (i === 5) positionClass += "top-10 -left-6"; // 成長性

        return (
          <div key={i} className={positionClass}>
            <p className="text-zinc-400">{STAT_LABELS[i]}</p>
            <p className="text-white text-sm">{Math.round(val)}</p>
          </div>
        );
      })}
    </div>
  );
}


export default function NewRunnerPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [isFetchingCities, setIsFetchingCities] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    prefecture: '',
    city: '',
    team_type: '',
    background: '' as BackgroundKey | '',
    running_form: '',
    foot_strike: '',
    height: '',
    weight: '',
  });

  // 市区町村取得API
  useEffect(() => {
    const fetchCities = async () => {
      if (!formData.prefecture) {
        setAvailableCities([]);
        return;
      }
      setIsFetchingCities(true);
      try {
        const res = await fetch(`https://geoapi.heartrails.com/api/json?method=getCities&prefecture=${encodeURIComponent(formData.prefecture)}`);
        const data = await res.json();
        if (data.response && data.response.location) {
          const cities = data.response.location.map((loc: any) => loc.city);
          setAvailableCities(Array.from(new Set(cities)) as string[]);
        }
      } catch (error) {
        console.error("市区町村取得エラー", error);
      } finally {
        setIsFetchingCities(false);
      }
    };
    fetchCities();
  }, [formData.prefecture]);

  // --- パラメータ計算ロジック ---
  const currentStats = useMemo(() => {
    // 0:スピード, 1:スタミナ, 2:VO2Max, 3:LT値, 4:メンタル, 5:成長性
    let stats = [50, 50, 50, 50, 50, 50]; 

    // ① バックボーンのベース値
    if (formData.background) {
      stats = [...BACKGROUNDS[formData.background].baseStats];
    }

    // ② BMIの計算と補正（BMI = 体重kg / 身長mの2乗）
    if (formData.height && formData.weight) {
      const bmi = parseFloat(formData.weight) / Math.pow(parseFloat(formData.height) / 100, 2);
      if (bmi < 19) {
        // 軽量：スタミナと心肺機能UP、スピード（パワー）DOWN
        stats[1] += 15; stats[2] += 10; stats[0] -= 10;
      } else if (bmi > 22) {
        // 重量：パワー（スピード）UP、スタミナDOWN
        stats[0] += 15; stats[1] -= 15; stats[2] -= 5;
      }
    }

    // ③ ランニングフォーム補正
    if (formData.running_form === 'ピッチ走法') {
      stats[1] += 10; stats[4] += 5; stats[0] -= 5; // スタミナ・メンタルUP
    } else if (formData.running_form === 'ストライド走法') {
      stats[0] += 15; stats[1] -= 10; // スピード大幅UP・スタミナDOWN
    }

    // ④ 接地タイプ補正
    if (formData.foot_strike === 'フォアフット') {
      stats[0] += 10; stats[3] += 10; stats[1] -= 15; // スピード・LT値UP、脚持ち(スタミナ)極端DOWN
    } else if (formData.foot_strike === 'ヒールストライク') {
      stats[1] += 10; stats[0] -= 5; // スタミナ安定、スピード減
    }

    // ⑤ 所属チーム補正
    if (formData.team_type === '大学') { stats[0] += 5; stats[4] -= 10; }
    if (formData.team_type === 'プロ') { stats = stats.map(s => s + 10); stats[5] -= 20; } // 初期能力高いが伸びしろ少ない

    // 最小10、最大100に収める（クランプ処理）
    return stats.map(s => Math.max(10, Math.min(100, s)));
  }, [formData.background, formData.height, formData.weight, formData.running_form, formData.foot_strike, formData.team_type]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.email) return alert("ログイン情報が見つかりません");

    const isAllFilled = Object.values(formData).every(val => val !== '');
    if (!isAllFilled) return alert("すべての項目を選択・入力してください。");
    
    setLoading(true);

    // 最終的なパラメータも一緒に送信する
    const submitData = {
      ...formData,
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
      speed: currentStats[0],
      stamina: currentStats[1],
      vo2_max: currentStats[2],
      lt_value: currentStats[3],
      mental: currentStats[4],
      growth: currentStats[5]
    };
    
    const res = await fetch("http://127.0.0.1:3000/api/v1/runners", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ runner: submitData, email: session.user.email }),
    });

    setLoading(false);
    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      alert("ランナーの作成に失敗しました。");
    }
  };

  return (
    <main className="min-h-screen bg-zinc-900 text-zinc-100 py-10 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 左側：入力フォーム（2カラム分） */}
        <div className="lg:col-span-2 bg-zinc-800 p-8 rounded-2xl border border-zinc-700 shadow-2xl">
          <h1 className="text-3xl font-black text-orange-500 italic mb-2 border-b-2 border-orange-500/30 pb-4 uppercase tracking-tighter">
            Runner Registration
          </h1>
          
          <form id="runner-form" onSubmit={handleSubmit} className="space-y-8 mt-8">
            {/* 基本プロフ */}
            <section className="space-y-6">
              <h2 className="text-lg font-bold text-zinc-400 border-l-4 border-orange-500 pl-3">基本プロフィール</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-xs font-black text-zinc-500 mb-2 uppercase">選手名</label>
                  <input required type="text" className="w-full bg-zinc-900 border border-zinc-600 rounded p-3 text-white focus:border-orange-500" 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="例: 韋駄天 太郎" />
                </div>
                <div>
                  <label className="block text-xs font-black text-zinc-500 mb-2 uppercase">出身都道府県</label>
                  <select required className="w-full bg-zinc-900 border border-zinc-600 rounded p-3 text-white focus:border-orange-500"
                    value={formData.prefecture} onChange={e => setFormData({...formData, prefecture: e.target.value, city: ''})}>
                    <option value="" disabled>選択してください</option>
                    {PREFECTURES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-zinc-500 mb-2 uppercase">市区町村</label>
                  <select required className="w-full bg-zinc-900 border border-zinc-600 rounded p-3 text-white focus:border-orange-500 disabled:opacity-30"
                    value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} disabled={!formData.prefecture || isFetchingCities}>
                    <option value="" disabled>{isFetchingCities ? "取得中..." : "選択してください"}</option>
                    {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </section>

            {/* 出自と所属 */}
            <section className="space-y-6">
              <h2 className="text-lg font-bold text-zinc-400 border-l-4 border-orange-500 pl-3">バックボーン（出自）</h2>
              <div className="grid grid-cols-1 gap-4">
                <select required className="w-full bg-zinc-900 border border-zinc-600 rounded p-3 text-white focus:border-orange-500"
                  value={formData.background} onChange={e => setFormData({...formData, background: e.target.value as BackgroundKey})}>
                  <option value="" disabled>陸上を始めたきっかけを選択</option>
                  {(Object.keys(BACKGROUNDS) as BackgroundKey[]).map(k => (
                    <option key={k} value={k}>{BACKGROUNDS[k].label}</option>
                  ))}
                </select>
                {formData.background && (
                  <p className="text-sm text-zinc-400 bg-zinc-900/50 p-3 rounded">{BACKGROUNDS[formData.background].desc}</p>
                )}
                
                <label className="block text-xs font-black text-zinc-500 mt-2 uppercase">所属チーム種別</label>
                <select required className="w-full bg-zinc-900 border border-zinc-600 rounded p-3 text-white focus:border-orange-500"
                  value={formData.team_type} onChange={e => setFormData({...formData, team_type: e.target.value})}>
                  <option value="" disabled>選択してください</option>
                  <option value="市民ランナー">市民ランナー</option>
                  <option value="大学">大学</option>
                  <option value="実業団">実業団</option>
                  <option value="プロ">プロ</option>
                </select>
              </div>
            </section>

            {/* 身体特性・フォーム */}
            <section className="space-y-6">
              <h2 className="text-lg font-bold text-zinc-400 border-l-4 border-orange-500 pl-3">身体特性・フォーム</h2>
              <div className="grid grid-cols-2 gap-4 bg-zinc-900/30 p-4 rounded-xl border border-zinc-700/50">
                <div>
                  <label className="block text-xs font-black text-zinc-500 mb-2 uppercase">身長 (cm)</label>
                  <input required type="number" step="0.1" className="w-full bg-zinc-900 border border-zinc-600 rounded p-3" 
                    value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} placeholder="170.0" />
                </div>
                <div>
                  <label className="block text-xs font-black text-zinc-500 mb-2 uppercase">体重 (kg)</label>
                  <input required type="number" step="0.1" className="w-full bg-zinc-900 border border-zinc-600 rounded p-3" 
                    value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} placeholder="60.0" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-black text-zinc-500 mb-2 uppercase">ランニングフォーム</label>
                  <div className="flex gap-2">
                    {["ピッチ走法", "ストライド走法"].map(f => (
                      <label key={f} className="flex-1 text-center p-3 bg-zinc-900 border border-zinc-600 rounded cursor-pointer has-[:checked]:border-orange-500 has-[:checked]:bg-orange-500/10">
                        <input type="radio" name="running_form" value={f} checked={formData.running_form === f} onChange={e => setFormData({...formData, running_form: e.target.value})} className="hidden" />
                        <span className={`text-sm font-bold ${formData.running_form === f ? 'text-orange-500' : 'text-zinc-500'}`}>{f}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-black text-zinc-500 mb-2 uppercase">接地タイプ</label>
                  <div className="flex gap-2">
                    {["フォアフット", "ミッドフット", "ヒールストライク"].map(s => (
                      <button key={s} type="button" onClick={() => setFormData({...formData, foot_strike: s})}
                        className={`flex-1 p-2 text-xs font-bold rounded border ${formData.foot_strike === s ? 'bg-orange-500 border-orange-500 text-white' : 'bg-zinc-900 border-zinc-700 text-zinc-400'}`}>
                        {s.replace("ストライク", "")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </form>
        </div>

        {/* 右側：レーダーチャートと最終決定ボタン（1カラム分、画面スクロールに追従） */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-zinc-800 p-6 rounded-2xl border border-zinc-700 shadow-2xl flex flex-col justify-between min-h-[500px]">
            <div>
              <h3 className="text-center font-black text-xl italic text-white mb-8 border-b border-zinc-700 pb-4">PARAMETER PREVIEW</h3>
              
              {/* ▼ 自作レーダーチャートコンポーネント ▼ */}
              {formData.background ? (
                <div className="animate-in fade-in zoom-in duration-500">
                   <RadarChart stats={currentStats} />
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-zinc-600 text-sm italic text-center">
                  きっかけを選択すると<br/>能力値チャートが表示されます
                </div>
              )}
            </div>

            <div className="mt-8 space-y-4">
              <button form="runner-form" disabled={loading} className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-4 rounded-xl shadow-xl shadow-orange-900/40 transition-all active:scale-95 text-lg italic uppercase">
                {loading ? "Creating..." : "Start Running"}
              </button>
              <Link href="/" className="block text-center w-full py-3 rounded-xl font-bold text-zinc-500 hover:bg-zinc-700 transition-all">
                キャンセル
              </Link>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}