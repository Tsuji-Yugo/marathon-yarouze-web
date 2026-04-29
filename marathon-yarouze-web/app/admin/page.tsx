import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // 管理者判定
  // @ts-ignore
  if (!session?.user?.isAdmin) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-800">
      
      {/* --- 左サイドバー (アイコンメニュー) --- */}
      <aside className="w-16 bg-slate-800 flex flex-col items-center py-4 gap-6 text-slate-400">
        <div className="text-white font-black text-xl mb-4">M</div>
        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-white">📊</button>
        <button className="p-2 bg-blue-600 rounded-lg text-white">🏁</button>
        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">👤</button>
        <div className="mt-auto">
          <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">⚙️</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        
        {/* --- 上部ヘッダー --- */}
        <header className="h-12 bg-blue-800 flex items-center justify-between px-6 text-white shadow-md">
          <div className="text-sm font-bold tracking-wider">MARATHON YAROUZE Admin Portal</div>
          <div className="flex items-center gap-4 text-xs">
            <span>日本語 ▼</span>
            <span className="font-bold underline cursor-pointer">{session?.user?.email}</span>
          </div>
        </header>

        {/* --- メインコンテンツ --- */}
        <main className="p-6">
          <div className="bg-white rounded shadow-sm border border-slate-200">
            
            {/* タイトルエリア */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h1 className="text-xl font-bold text-slate-700">大会データ管理</h1>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-bold flex items-center gap-1">
                <span>＋</span> 新規登録
              </button>
            </div>

            {/* --- データテーブルエリア --- */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b">
                  <tr>
                    <th className="p-3 border-r w-12">ID</th>
                    <th className="p-3 border-r">大会名</th>
                    <th className="p-3 border-r">都道府県</th>
                    <th className="p-3 border-r">開催種目</th>
                    <th className="p-3 border-r">ステータス</th>
                    <th className="p-3 border-r">登録日</th>
                    <th className="p-3 text-center">操作</th>
                  </tr>
                  
                  {/* --- フィルタ行 (参考画像の ②〜⑥ の部分) --- */}
                  <tr className="bg-white border-b">
                    <td className="p-2 border-r"><input type="text" className="w-full border p-1 rounded bg-slate-50 text-xs" placeholder="ID..." /></td>
                    <td className="p-2 border-r"><input type="text" className="w-full border p-1 rounded bg-slate-50 text-xs" placeholder="Filter this thing" /></td>
                    <td className="p-2 border-r">
                      <select className="w-full border p-1 rounded bg-slate-50 text-xs text-slate-400">
                        <option>-</option>
                        <option>東京都</option>
                        <option>石川県</option>
                      </select>
                    </td>
                    <td className="p-2 border-r">
                      <select className="w-full border p-1 rounded bg-slate-50 text-xs text-slate-400">
                        <option>-</option>
                        <option>フル</option>
                        <option>ハーフ</option>
                      </select>
                    </td>
                    <td className="p-2 border-r"><input type="text" className="w-full border p-1 rounded bg-slate-50 text-xs" placeholder="Select status" /></td>
                    <td className="p-2 border-r"><input type="text" className="w-full border p-1 rounded bg-slate-50 text-xs" placeholder="Select date range" /></td>
                    <td className="p-2"></td>
                  </tr>
                </thead>

                <tbody className="text-slate-600">
                  {/* ダミーデータ1 */}
                  <tr className="border-b hover:bg-blue-50 transition-colors">
                    <td className="p-3 border-r">0001</td>
                    <td className="p-3 border-r font-bold">金沢マラソン 2026</td>
                    <td className="p-3 border-r">石川県</td>
                    <td className="p-3 border-r">フルマラソン</td>
                    <td className="p-3 border-r"><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">公開中</span></td>
                    <td className="p-3 border-r text-slate-400">2026/04/01</td>
                    <td className="p-3">
                      <div className="flex justify-center gap-3">
                        <button className="text-green-600 hover:text-green-800 text-lg">📝</button>
                        <button className="text-red-500 hover:text-red-700 text-lg">🗑️</button>
                      </div>
                    </td>
                  </tr>
                  {/* ダミーデータ2 */}
                  <tr className="border-b hover:bg-blue-50 transition-colors bg-slate-50/30">
                    <td className="p-3 border-r">0002</td>
                    <td className="p-3 border-r font-bold">東京マラソン 2027</td>
                    <td className="p-3 border-r">東京都</td>
                    <td className="p-3 border-r">フルマラソン</td>
                    <td className="p-3 border-r"><span className="bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full text-xs font-bold">準備中</span></td>
                    <td className="p-3 border-r text-slate-400">2026/04/29</td>
                    <td className="p-3">
                      <div className="flex justify-center gap-3">
                        <button className="text-green-600 hover:text-green-800 text-lg">📝</button>
                        <button className="text-red-500 hover:text-red-700 text-lg">🗑️</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* --- ページネーションエリア --- */}
            <div className="p-4 bg-slate-50 flex justify-between items-center text-xs text-slate-500 font-bold border-t">
              <div className="flex items-center gap-2">
                表示件数: 
                <select className="border rounded p-1 bg-white" defaultValue="100">
                  <option value="10">10</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
              <div className="flex items-center gap-4">
                <span>1 - 2 / 2</span>
                <div className="flex gap-2">
                  <button className="px-2 py-1 border rounded bg-white text-slate-300" disabled>前</button>
                  <button className="px-2 py-1 border rounded bg-white hover:bg-slate-100 transition-colors">次</button>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}