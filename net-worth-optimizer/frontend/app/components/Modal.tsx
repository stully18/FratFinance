'use client'

interface ModalProps {
  isOpen: boolean
  title: string
  description?: string
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string
  cancelText?: string
  isDangerous?: boolean
  isLoading?: boolean
}

export function Modal({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  isLoading = false
}: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-w-md w-full animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="border-b border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          {description && <p className="text-slate-400 text-sm mt-2">{description}</p>}
        </div>

        {/* Footer with Actions */}
        <div className="flex gap-3 p-6 bg-slate-900">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${
              isDangerous
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white'
            }`}
          >
            {isLoading ? 'Loading...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
