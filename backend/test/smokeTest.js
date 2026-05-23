import axios from 'axios'

const API = process.env.API_URL || 'http://localhost:5000/api'

async function run() {
  try {
    console.log('Health check...')
    const health = await axios.get(`${API}/`)
    console.log('Health:', health.data)

    console.log('Tax preview test...')
    const tax = await axios.post(`${API}/elite-audit/tax-preview`, { annualSalary: 600000, otherIncome: 20000 })
    console.log('Tax preview response:', tax.data)

    console.log('OCR test (mock URL)...')
    // This will fallback to cloud or sample parsing depending on OCR engine
    const ocr = await axios.post(`${API}/elite-audit/ocr`, { fileUrl: 'https://example.com/receipt.jpg' })
    console.log('OCR response:', ocr.data)

    console.log('Smoke tests completed successfully.')
  } catch (err) {
    console.error('Smoke test error:', err.response ? err.response.data : err.message)
    process.exit(1)
  }
}

run()
