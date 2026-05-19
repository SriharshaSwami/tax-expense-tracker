import React, { useState, useRef } from 'react'
import toast from 'react-hot-toast'

const FileUpload = ({ file, setFile, existingReceipt, onRemoveExisting, onScan }) => {
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  // Maximum allowed file size: 5MB
  const MAX_FILE_SIZE = 5 * 1024 * 1024
  const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'pdf']

  // Validate file dimensions, size and extensions
  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return

    const extension = selectedFile.name.split('.').pop().toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      toast.error('Invalid file format! Only JPG, JPEG, PNG, WEBP, and PDF are supported.')
      return
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error('File too large! Maximum limit is 5MB.')
      return
    }

    // Set file state
    setFile(selectedFile)

    // Simulate a premium upload loading state for visual engagement
    setIsUploading(true)
    setUploadProgress(10)
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          toast.success(`${selectedFile.name} attached successfully!`)
          return 100
        }
        return prev + 15
      })
    }, 80)
  }

  // Handle Drag Over
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  // Handle Drop
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  // Handle Manual File Choice
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0])
    }
  }

  // Trigger File Input Click
  const onButtonClick = () => {
    fileInputRef.current.click()
  }

  // Clear current upload
  const handleClearUpload = () => {
    setFile(null)
    setUploadProgress(0)
    setIsUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    toast.success('Attached file removed')
  }

  // Format File Size
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-3">
      <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Receipt Attachment</label>
      
      {/* 1. RENDER EXISTING RECEIPT IF PRESENT */}
      {existingReceipt && existingReceipt.url && !file && (
        <div className="flex items-center justify-between border border-emerald-200 bg-emerald-50/50 rounded-xl p-3 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${existingReceipt.fileType === 'pdf' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-100 text-emerald-700'}`}>
              {existingReceipt.fileType === 'pdf' ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375 3.75 0 11-.75 0 .375 3.75 0 01.75 0z" />
                </svg>
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700">Receipt Attached</p>
              <a href={existingReceipt.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-emerald-700 font-semibold hover:underline">
                View current file ({existingReceipt.fileType.toUpperCase()})
              </a>
            </div>
          </div>
          
          <button
            type="button"
            onClick={onRemoveExisting}
            className="rounded-lg p-1.5 text-slate-450 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
            title="Remove current receipt"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* 2. RENDER DRAG & DROP ZONE */}
      {(!existingReceipt || !existingReceipt.url || file) && (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-4 text-center transition ${
            dragActive
              ? 'border-emerald-500 bg-emerald-50/30'
              : file
              ? 'border-slate-200 bg-slate-50/20'
              : 'border-slate-300 hover:border-emerald-450 hover:bg-slate-50/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            name="receipt"
            className="hidden"
            accept=".jpg,.jpeg,.png,.webp,.pdf"
            onChange={handleFileChange}
          />

          {!file ? (
            <div className="space-y-2 cursor-pointer" onClick={onButtonClick}>
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700">
                  Drag and drop your receipt, or <span className="text-emerald-600 font-bold hover:underline">browse</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Supports JPG, PNG, WEBP, PDF up to 5MB</p>
              </div>
            </div>
          ) : (
            /* FILE DETAILS & PROGRESS BAR */
            <div className="space-y-3">
              <div className="flex items-center justify-between border border-slate-150 rounded-lg p-2.5 bg-slate-50">
                <div className="flex items-center space-x-2 text-left min-w-0">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${file.name.endsWith('.pdf') ? 'bg-red-50 text-red-650' : 'bg-emerald-50 text-emerald-650'}`}>
                    {file.name.endsWith('.pdf') ? (
                      <span className="text-[9px] font-bold">PDF</span>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-4.5 w-4.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375 3.75 0 11-.75 0 .375 3.75 0 01.75 0z" />
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-slate-700">{file.name}</p>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <p className="text-[10px] text-slate-450">{formatSize(file.size)}</p>
                      {onScan && !isUploading && (
                        <>
                          <span className="h-1 w-1 rounded-full bg-slate-300" />
                          <button
                            type="button"
                            onClick={() => onScan(file)}
                            className="text-[10px] text-emerald-600 font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                          >
                            ⚡ Scan with AI
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClearUpload}
                  className="rounded-md p-1 text-slate-400 hover:text-red-500 hover:bg-slate-100 transition cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* UPLOAD PROGRESS TRACK BAR */}
              {isUploading && (
                <div className="space-y-1 text-left">
                  <div className="flex items-center justify-between text-[9px] text-slate-450 font-bold">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-650 transition-all duration-100"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default FileUpload
