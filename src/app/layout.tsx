import "./globals.css"
import Link from "next/link"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">

      <body className="bg-slate-50 min-h-screen flex flex-col">

        {/* Navigation */}

        <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">

          <h1 className="text-xl font-bold text-blue-600">
            InvoiceAI
          </h1>

          <div className="flex gap-6 text-gray-700 font-medium">

            <Link href="/dashboard" className="hover:text-blue-600">
              Dashboard
            </Link>

            <Link href="/upload" className="hover:text-blue-600">
              Upload
            </Link>

            <Link href="/approvals" className="hover:text-blue-600">
              Approvals
            </Link>

          </div>

        </nav>

        {/* Main Content */}

        <main className="max-w-6xl mx-auto w-full flex-grow mt-10">
          {children}
        </main>

        {/* Footer */}

        <footer className="text-center text-sm text-gray-500 py-6 mt-10">

          <p>
            Invoice AI System — Built with Next.js & Supabase
          </p>

        </footer>

      </body>

    </html>
  )
}