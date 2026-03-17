import PDFParser from "pdf2json"

export async function POST(req: Request) {

  try {

    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const pdfParser = new PDFParser()

    const text: string = await new Promise((resolve) => {

      pdfParser.on("pdfParser_dataReady", (data: any) => {
        let extracted = ""

        data.Pages.forEach((page: any) => {
          page.Texts.forEach((textItem: any) => {
            textItem.R.forEach((t: any) => {
              extracted += decodeURIComponent(t.T) + " "
            })
          })
        })

        resolve(extracted)
      })

      pdfParser.parseBuffer(buffer)
    })

    console.log("PDF TEXT:", text)

    // SIMPLE EXTRACTION LOGIC

    const vendorMatch = text.match(/(PTY LTD|LIMITED|LTD|INC|COMPANY|CORP)/i)
    const amountMatch = text.match(/(total|amount)[^\d]*(\d+[\.,]?\d*)/i)
    const vatMatch = text.match(/(vat)[^\d]*(\d+[\.,]?\d*)/i)
    const dateMatch = text.match(/(\d{2}[\/\-]\d{2}[\/\-]\d{4})/)

    const data = {
      vendor: vendorMatch ? vendorMatch[0] : "Unknown Vendor",
      invoice_number: "N/A",
      date: dateMatch ? dateMatch[0] : "",
      amount: amountMatch ? amountMatch[2] : "0",
      vat: vatMatch ? vatMatch[2] : "0"
    }

    console.log("EXTRACTED DATA:", data)

    return Response.json({ data: JSON.stringify(data) })

  } catch (error) {

    console.error("EXTRACTION ERROR:", error)

    return Response.json(
      { error: "Extraction failed" },
      { status: 500 }
    )
  }
}