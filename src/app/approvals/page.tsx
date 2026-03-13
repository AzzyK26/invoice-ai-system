"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function ApprovalsPage() {

  const [invoices, setInvoices] = useState<any[]>([])

  async function loadInvoices() {

    const { data } = await supabase
      .from("invoices")
      .select("*")
      .order("created_at", { ascending: false })

    if (data) setInvoices(data)
  }

  useEffect(() => {
    loadInvoices()
  }, [])

  async function approve(id: string, column: string) {

    await supabase
      .from("invoices")
      .update({ [column]: true })
      .eq("id", id)

    loadInvoices()
  }

  return (

    <div className="p-10">

      <h1 className="text-3xl font-bold mb-8">
        Invoice Approvals
      </h1>

      <table className="w-full bg-white rounded-xl shadow-md overflow-hidden text-gray-800">

        <thead className="bg-gray-100 text-gray-700 font-semibold">
          <tr>
            <th className="p-3 border">File</th>
            <th className="p-3 border">Vendor</th>
            <th className="p-3 border">Amount</th>
            <th className="p-3 border">Reviewer</th>
            <th className="p-3 border">Manager</th>
            <th className="p-3 border">Finance</th>
          </tr>
        </thead>

        <tbody>

          {invoices.map((inv) => (

            <tr key={inv.id}>

              <td className="border p-3">
                {inv.file_path}
              </td>

              <td className="border p-3">
                {inv.vendor || "-"}
              </td>

              <td className="border p-3">
                {inv.amount || "-"}
              </td>

              <td className="border p-3">

                {inv.reviewer_approved ? (
                  "Approved"
                ) : (
                  <button
                    onClick={() => approve(inv.id, "reviewer_approved")}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>
                )}

              </td>

              <td className="border p-3">

                {inv.manager_approved ? (
                  "Approved"
                ) : (
                  <button
                    onClick={() => approve(inv.id, "manager_approved")}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>
                )}

              </td>

              <td className="border p-3">

                {inv.finance_approved ? (
                  "Approved"
                ) : (
                  <button
                    onClick={() => approve(inv.id, "finance_approved")}
                    className="bg-purple-500 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>
                )}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )

}