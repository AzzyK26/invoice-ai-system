export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-10">

      <h1 className="text-5xl font-bold">
        Invoice AI System
      </h1>

      <p className="text-gray-400 text-lg">
        Automated invoice extraction and approval workflow
      </p>

      <div className="flex gap-6">

        <a
          href="/dashboard"
          className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Dashboard
        </a>

        <a
          href="/upload"
          className="bg-green-600 px-6 py-3 rounded-lg hover:bg-green-700"
        >
          Upload Invoice
        </a>

        <a
          href="/approvals"
          className="bg-purple-600 px-6 py-3 rounded-lg hover:bg-purple-700"
        >
          Approvals
        </a>

      </div>

    </main>
  )
}