"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function InvoicesPage() {

  const [invoices, setInvoices] = useState<any[]>([])

  useEffect(() => {
    fetchInvoices()
  }, [])

  async function fetchInvoices() {

    const { data } = await supabase
      .from("invoices")
      .select("*")
      .order("created_at", { ascending: false })

    setInvoices(data || [])

  }

  async function approve(id: string, role: string) {

    const update: any = {}

    if (role === "reviewer") update.reviewer_approved = true
    if (role === "manager") update.manager_approved = true
    if (role === "finance") update.finance_approved = true

    await supabase
      .from("invoices")
      .update(update)
      .eq("id", id)

    fetchInvoices()
  }

  return (

    <div className="p-10">

      <h1 className="text-2xl font-bold mb-6">
        Invoices
      </h1>

      <table className="w-full border">

        <thead>

          <tr>
            <th className="border p-2">Vendor</th>
            <th className="border p-2">Invoice #</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>

        </thead>

        <tbody>

          {invoices.map((invoice) => (

            <tr key={invoice.id}>

              <td className="border p-2">{invoice.vendor || "-"}</td>
              <td className="border p-2">{invoice.invoice_number || "-"}</td>
              <td className="border p-2">{invoice.amount || "-"}</td>
              <td className="border p-2">{invoice.status}</td>

              <td className="border p-2">

                <button
                  className="bg-blue-500 text-white px-3 py-1 mr-2"
                  onClick={() => approve(invoice.id, "reviewer")}
                >
                  Reviewer
                </button>

                <button
                  className="bg-green-500 text-white px-3 py-1 mr-2"
                  onClick={() => approve(invoice.id, "manager")}
                >
                  Manager
                </button>

                <button
                  className="bg-purple-500 text-white px-3 py-1"
                  onClick={() => approve(invoice.id, "finance")}
                >
                  Finance
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )
}