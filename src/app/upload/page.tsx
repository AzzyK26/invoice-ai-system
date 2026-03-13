"use client"

import { useDropzone } from "react-dropzone"
import { supabase } from "@/lib/supabase"

export default function UploadPage() {

  const onDrop = async (files: File[]) => {

    const file = files[0]

    if (!file) return

    try {

      // check duplicate based on filename
      const { data: existing } = await supabase
        .from("invoices")
        .select("*")
        .ilike("file_path", `%${file.name}%`)
        .limit(1)

      if (existing && existing.length > 0) {
        alert("Duplicate invoice detected")
        return
      }

      const filePath = `uploads/${Date.now()}-${file.name}`

      const { data, error } = await supabase.storage
        .from("documents")
        .upload(filePath, file)

      if (error) {
        console.error(error)
        alert("Upload failed")
        return
      }

      await supabase
        .from("invoices")
        .insert([
          {
            file_path: filePath,
            status: "pending"
          }
        ])

      alert("Invoice uploaded successfully")

    } catch (err) {

      console.error(err)
      alert("Processing failed")

    }

  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (

    <div className="p-10">

      <h1 className="text-3xl font-bold mb-8">
        Upload Invoice
      </h1>

      <div className="bg-white rounded-xl shadow-md p-10 border border-gray-100">

        <div
          {...getRootProps()}
          className={`
            border-2
            border-dashed
            rounded-xl
            p-20
            text-center
            cursor-pointer
            transition
            ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
          `}
        >

          <input {...getInputProps()} />

          <div className="flex flex-col items-center gap-4">

            <div className="text-5xl">📄</div>

            <p className="text-lg font-medium text-gray-700">
              Drag & drop your invoice here
            </p>

            <p className="text-gray-400">
              or click to upload
            </p>

            <p className="text-xs text-gray-400 mt-4">
              Supported formats: PDF
            </p>

          </div>

        </div>

      </div>

    </div>

  )
}