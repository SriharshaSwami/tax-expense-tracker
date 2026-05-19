import React, { useEffect } from 'react'

const PreviewModal = ({ isOpen, onClose, receiptUrl, transactionTitle }) => {
  // Lock body scroll when preview modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || !receiptUrl) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 1. BACKDROP OVERLAY */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* 2. MODAL BOX */}
      <div className="relative max-h-[85vh] w-full max-w-2xl transform rounded-2xl bg-white p-4 shadow-2xl transition-all duration-300 flex flex-col z-10 border border-slate-100 animate-in fade-in zoom-in-95">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">Receipt Attachment Preview</h3>
            <p className="text-[10px] text-slate-450 mt-0.5">Bound to: <span className="font-semibold text-slate-650">{transactionTitle}</span></p>
          </div>
          <div className="flex items-center space-x-2">
            <a
              href={receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition flex items-center gap-1 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-3.5 w-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              Open Full
            </a>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* IMAGE PREVIEW FRAME */}
        <div className="flex-1 overflow-auto flex items-center justify-center bg-slate-50 rounded-xl p-2 min-h-[300px]">
          <img
            src={receiptUrl}
            alt={`Receipt for ${transactionTitle}`}
            className="max-h-[60vh] max-w-full rounded-lg object-contain shadow-xs border border-slate-200/50"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = 'https://res.cloudinary.com/demo/image/upload/v1570975139/receipt_placeholder.png'
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default PreviewModal
