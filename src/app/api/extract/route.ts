import PDFParser from "pdf2json"

export async function POST(req: Request) {

  try {

    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return Response.json({ error: "No file" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const pdfParser = new PDFParser()

    const text: string = await new Promise((resolve) => {

      pdfParser.on("pdfParser_dataReady", (data: any) => {
        let extracted = ""

        data.Pages.forEach((page: any) => {
          page.Texts.forEach((t: any) => {
            t.R.forEach((r: any) => {
              extracted += decodeURIComponent(r.T) + " "
            })
          })
        })

        resolve(extracted)
      })

      pdfParser.parseBuffer(buffer)
    })

    console.log("PDF TEXT:", text)

    // VERY SIMPLE BUT RELIABLE EXTRACTION

    const amount = (text.match(/(\d+[.,]\d{2})/g) || []).pop() || "0"

    const date = text.match(/\d{2}[\/\-]\d{2}[\/\-]\d{4}/)?.[0] || ""

    const vendor = text.split(" ").slice(0, 5).join(" ") || "Unknown Vendor"

    const result = {
      vendor,
      invoice_number: "AUTO",
      date,
      amount,
      vat: "0"
    }

    console.log("FINAL EXTRACTED:", result)

    return Response.json({
      data: JSON.stringify(result)
    })

  } catch (err) {

    console.error("EXTRACTION ERROR:", err)

    return Response.json(
      { error: "Extraction failed" },
      { status: 500 }
    )
  }
}