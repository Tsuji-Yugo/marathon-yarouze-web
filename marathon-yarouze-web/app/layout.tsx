import './globals.css'
import NextAuthProvider from '@/components/NextAuthProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="bg-zinc-900">
        {/* ▼ ここに Provider を追加して children を包む */}
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  )
}