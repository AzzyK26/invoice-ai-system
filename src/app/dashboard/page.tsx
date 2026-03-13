"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Dashboard() {

  const [stats, setStats] = useState({
    totalInvoices: 0,
    pending: 0,
    approved: 0,
    totalAmount: 0
  })

  const [recentInvoices, setRecentInvoices] = useState<any[]>([])

  async function loadData() {

    const { data } = await supabase
      .from("invoices")
      .select("*")
      .order("created_at", { ascending: false })

    if (!data) return

    const totalInvoices = data.length

    const pending = data.filter(
      (i) =>
        !i.reviewer_approved ||
        !i.manager_approved ||
        !i.finance_approved
    ).length

    const approved = data.filter(
      (i) =>
        i.reviewer_approved &&
        i.manager_approved &&
        i.finance_approved
    ).length

    const totalAmount = data.reduce(
      (sum, inv) => sum + (Number(inv.amount) || 0),
      0
    )

    setStats({
      totalInvoices,
      pending,
      approved,
      totalAmount
    })

    setRecentInvoices(data.slice(0, 5))
  }

  useEffect(() => {
    loadData()
  }, [])

  return (

    <div className="p-10">

      <h1 className="text-3xl font-bold mb-10">
        Finance Dashboard
      </h1>

      {/* Stats Cards */}

      <div className="grid grid-cols-4 gap-8 mb-12">

        <div className="bg-white text-gray-800 rounded-xl shadow-md p-6 border border-gray-200">
          <p className="text-gray-500 text-sm mb-2">Total Invoices</p>
          <h2 className="text-3xl font-bold">{stats.totalInvoices}</h2>
          <p className="text-xs text-gray-400 mt-2">
            All uploaded invoices
          </p>
        </div>

        <div className="bg-white text-gray-800 rounded-xl shadow-md p-6 border border-gray-200">
          <p className="text-gray-500 text-sm mb-2">Pending Approval</p>
          <h2 className="text-3xl font-bold text-orange-500">
            {stats.pending}
          </h2>
          <p className="text-xs text-gray-400 mt-2">
            Awaiting approvals
          </p>
        </div>

        <div className="bg-white text-gray-800 rounded-xl shadow-md p-6 border border-gray-200">
          <p className="text-gray-500 text-sm mb-2">Fully Approved</p>
          <h2 className="text-3xl font-bold text-green-600">
            {stats.approved}
          </h2>
          <p className="text-xs text-gray-400 mt-2">
            Completed approval workflow
          </p>
        </div>

        <div className="bg-white text-gray-800 rounded-xl shadow-md p-6 border border-gray-200">
          <p className="text-gray-500 text-sm mb-2">Total Spend</p>
          <h2 className="text-3xl font-bold">
            ${stats.totalAmount.toLocaleString()}
          </h2>
          <p className="text-xs text-gray-400 mt-2">
            Combined invoice value
          </p>
        </div>

      </div>

      {/* Recent Invoices Table */}

      <div className="bg-white rounded-xl shadow-md border border-gray-100">

        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">
            Recent Invoices
          </h2>
        </div>

        <table className="w-full">

          <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">

            <tr>
              <th className="p-4">File</th>
              <th className="p-4">Vendor</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
            </tr>

          </thead>

          <tbody>

            {recentInvoices.map((inv) => {

              const approved =
                inv.reviewer_approved &&
                inv.manager_approved &&
                inv.finance_approved

              return (

                <tr key={inv.id} className="border-t text-gray-700">

                  <td className="p-4 text-sm">
                    {inv.file_path?.split("/").pop()}
                  </td>

                  <td className="p-4 text-sm">
                    {inv.vendor || "-"}
                  </td>

                  <td className="p-4 text-sm">
                    ${Number(inv.amount || 0).toLocaleString()}
                  </td>

                  <td className="p-4">

                    {approved ? (

                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                        Approved
                      </span>

                    ) : (

                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs">
                        Pending
                      </span>

                    )}

                  </td>

                </tr>

              )

            })}

          </tbody>

        </table>

      </div>

    </div>

  )
}