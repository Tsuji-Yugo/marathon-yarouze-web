import Link from 'next/link';

export default function GuestHero() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-6xl md:text-8xl font-black italic text-orange-500 mb-6 drop-shadow-2xl">
        RUN OR DIE.
      </h1>
      <p className="text-xl text-zinc-400 max-w-lg mb-10">
        限界を超えろ。最強のランナーを育成し、世界中のレースを制覇する本格マラソンシミュレーション。
      </p>
      <div className="flex gap-4">
        <Link href="/register" className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105">
          今すぐ走り出す
        </Link>
        <Link href="/login" className="border border-zinc-700 hover:bg-zinc-800 text-white px-8 py-4 rounded-full font-bold text-lg transition-all">
          ログイン
        </Link>
      </div>
    </div>
  );
}