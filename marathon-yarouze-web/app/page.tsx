async function getRunnerData() {
  const res = await fetch("http://localhost:3000/api/v1/runners", { cache: 'no-store' });
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
}

export default async function TopPage() {
  const runner = await getRunnerData();

  if (!runner) {
    return (
      <main className="min-h-screen bg-zinc-900 text-zinc-100 flex items-center justify-center">
        <p>選手データがありません。Railsで db:seed を実行してください。</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-900 text-zinc-100 p-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* ▼ 上段：現在のステータス */}
        <section>
          <h1 className="text-2xl font-bold mb-4 text-zinc-300">現在のステータス</h1>
          <div className="bg-zinc-800 p-6 rounded-xl border border-zinc-700 shadow-xl">
            <div className="flex items-end gap-4 mb-6">
              <p className="text-4xl font-extrabold text-orange-500">{runner.name}</p>
              <p className="text-zinc-400 text-lg mb-1">{runner.age}歳</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-zinc-900 p-4 rounded border-l-4 border-orange-500">
                <p className="text-zinc-400 text-sm">VO2 Max</p>
                <p className="text-2xl font-bold">{runner.vo2_max}</p>
              </div>
              <div className="bg-zinc-900 p-4 rounded border-l-4 border-blue-500">
                <p className="text-zinc-400 text-sm">LT値</p>
                <p className="text-2xl font-bold">{runner.lt_value}</p>
              </div>
              <div className="bg-zinc-900 p-4 rounded border-l-4 border-green-500">
                <p className="text-zinc-400 text-sm">スピード</p>
                <p className="text-2xl font-bold">{runner.speed || '---'}</p>
              </div>
              <div className="bg-zinc-900 p-4 rounded border-l-4 border-red-500">
                <p className="text-zinc-400 text-sm">耐久力</p>
                <p className="text-2xl font-bold">{runner.durability}</p>
              </div>
              <div className="bg-zinc-900 p-4 rounded">
                <p className="text-zinc-400 text-sm">メンタル</p>
                <p className="text-xl font-bold">{runner.mental}</p>
              </div>
              <div className="bg-zinc-900 p-4 rounded">
                <p className="text-zinc-400 text-sm">性格</p>
                <p className="text-xl font-bold">{runner.personality}</p>
              </div>
              <div className="bg-zinc-900 p-4 rounded">
                <p className="text-zinc-400 text-sm">レースまで</p>
                <p className="text-xl font-bold">あと {runner.days_to_race} 日</p>
              </div>
              <div className="bg-zinc-900 p-4 rounded border border-yellow-500/30">
                <p className="text-yellow-500 text-sm">所持金</p>
                <p className="text-xl font-bold text-yellow-400">¥{runner.funds?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ▼ 下段：アクションメニュー */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-zinc-300">行動を選択</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <button className="group relative bg-zinc-800 p-8 rounded-xl border-2 border-orange-600 hover:bg-orange-600 transition-all duration-200 overflow-hidden text-left shadow-[0_0_15px_rgba(234,88,12,0.3)] hover:shadow-[0_0_25px_rgba(234,88,12,0.6)]">
              <p className="text-4xl mb-4">🏆</p>
              <p className="text-2xl font-bold text-white mb-2">大会に出場</p>
              <p className="text-sm text-zinc-400 group-hover:text-orange-200">レースに挑み、賞金と名声を獲得する</p>
            </button>

            <button className="group relative bg-zinc-800 p-8 rounded-xl border-2 border-blue-600 hover:bg-blue-600 transition-all duration-200 overflow-hidden text-left shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)]">
              <p className="text-4xl mb-4">🏃‍♂️</p>
              <p className="text-2xl font-bold text-white mb-2">トレーニング</p>
              <p className="text-sm text-zinc-400 group-hover:text-blue-200">体力を消費して走力パラメータを上げる</p>
            </button>

            <button className="group relative bg-zinc-800 p-8 rounded-xl border-2 border-green-600 hover:bg-green-600 transition-all duration-200 overflow-hidden text-left shadow-[0_0_15px_rgba(22,163,74,0.3)] hover:shadow-[0_0_25px_rgba(22,163,74,0.6)]">
              <p className="text-4xl mb-4">💼</p>
              <p className="text-2xl font-bold text-white mb-2">仕事をする</p>
              <p className="text-sm text-zinc-400 group-hover:text-green-200">活動資金を稼ぐ</p>
            </button>

          </div>
        </section>

      </div>
    </main>
  );
}