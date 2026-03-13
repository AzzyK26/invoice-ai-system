"use client"

import { supabase } from "@/lib/supabase"
import { useEffect } from "react"

export default function Test() {

  useEffect(() => {

    async function testConnection() {

      const { data, error } = await supabase
        .from("documents")
        .select("*")

      console.log("DATA:", data)
      console.log("ERROR:", error)

    }

    testConnection()

  }, [])

  return <div>Supabase Connected</div>

}