import { useState } from 'react'
import { uploadReceipt, previewTax } from '@/services/eliteAuditService'

export default function EliteAudit() {
  const [fileUrl, setFileUrl] = useState('')
  const [ocrResult, setOcrResult] = useState(null)
  const [taxInputs, setTaxInputs] = useState({ annualSalary: '', otherIncome: '' })
  const [taxResult, setTaxResult] = useState(null)

  const handleUpload = async () => {
    try {
      const { data } = await uploadReceipt({ fileUrl })
      setOcrResult(data)
    } catch (err) {
      setOcrResult({ error: err?.response?.data || err.message })
    }
  }

  const handlePreviewTax = async () => {
    try {
      const inputs = {
        annualSalary: Number(taxInputs.annualSalary || 0),
        otherIncome: Number(taxInputs.otherIncome || 0),
      }
      const { data } = await previewTax(inputs)
      setTaxResult(data)
    } catch (err) {
      setTaxResult({ error: err?.response?.data || err.message })
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Elite Audit — Quick Test</h2>

      <section className="mb-6">
        <h3 className="font-medium">OCR Receipt</h3>
        <div className="flex gap-2 mt-2">
          <input className="flex-1" placeholder="Remote image URL" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} />
          <button className="btn" onClick={handleUpload}>Upload</button>
        </div>
        {ocrResult && (
          <pre className="mt-3 p-3 bg-gray-50 rounded">{JSON.stringify(ocrResult, null, 2)}</pre>
        )}
      </section>

      <section>
        <h3 className="font-medium">Tax Preview</h3>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <input placeholder="Annual Salary" value={taxInputs.annualSalary} onChange={(e) => setTaxInputs(x => ({ ...x, annualSalary: e.target.value }))} />
          <input placeholder="Other Income" value={taxInputs.otherIncome} onChange={(e) => setTaxInputs(x => ({ ...x, otherIncome: e.target.value }))} />
        </div>
        <div className="mt-3">
          <button className="btn" onClick={handlePreviewTax}>Preview</button>
        </div>
        {taxResult && (
          <pre className="mt-3 p-3 bg-gray-50 rounded">{JSON.stringify(taxResult, null, 2)}</pre>
        )}
      </section>
    </div>
  )
}
