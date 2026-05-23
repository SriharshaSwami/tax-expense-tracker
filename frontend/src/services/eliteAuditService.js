import api from '@/utils/api'

export const uploadReceipt = async ({ fileUrl, fileType, base64 }) => {
  const payload = {}
  if (fileUrl) payload.fileUrl = fileUrl
  if (fileType) payload.fileType = fileType
  if (base64) payload.base64 = base64

  const res = await api.post('/elite-audit/ocr', payload)
  return res.data
}

export const previewTax = async (inputs) => {
  const res = await api.post('/elite-audit/tax-preview', inputs)
  return res.data
}

export default {
  uploadReceipt,
  previewTax,
}
