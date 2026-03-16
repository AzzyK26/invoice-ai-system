import { GoogleGenerativeAI } from "@google/generative-ai"
import PDFParser from "pdf2json"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: Request) {

  try {

    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return Response.json({ error: "No file received" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const pdfParser = new PDFParser()

    const text = await new Promise<string>((resolve) => {

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

    console.log("PDF TEXT EXTRACTED:", text.substring(0, 200))

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest"
    })

    const prompt = `
Extract the following fields from this invoice:

Vendor
Invoice Number
Invoice Date
Total Amount
VAT Amount

Return ONLY JSON like this:

{
 "vendor":"",
 "invoice_number":"",
 "date":"",
 "amount":"",
 "vat":""
}

Invoice text:
${text}
`

    const result = await model.generateContent(prompt)

    const responseText = result.response.text()

    console.log("AI RESPONSE:", responseText)

    return Response.json({
      data: responseText
    })

  } catch (error) {

    console.error("API ERROR:", error)

    return Response.json({
      error: String(error)
    })

  }

}