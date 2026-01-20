'use client'

import React from 'react'

interface AlertProps {
  message: string
  onDismiss?: () => void
  autoClose?: boolean
  duration?: number
}

export function SuccessAlert({ message, onDismiss, autoClose = true, duration = 5000 }: AlertProps) {
  React.useEffect(() => {
    if (autoClose && onDismiss) {
      const timer = setTimeout(onDismiss, duration)
      return () => clearTimeout(timer)
    }
  }, [autoClose, duration, onDismiss])

  return (
    <div className="fixed top-4 right-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 max-w-md shadow-lg animate-in slide-in-from-right">
      <div className="flex items-start gap-3">
        <div className="text-emerald-400 text-2xl">✓</div>
        <div className="flex-1">
          <p className="text-emerald-400 font-medium">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-emerald-400 hover:text-emerald-300 transition"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

export function ErrorAlert({ message, onDismiss, autoClose = false }: AlertProps) {
  return (
    <div className="fixed top-4 right-4 bg-red-500/10 border border-red-500/20 rounded-lg p-4 max-w-md shadow-lg animate-in slide-in-from-right">
      <div className="flex items-start gap-3">
        <div className="text-red-400 text-2xl">✕</div>
        <div className="flex-1">
          <p className="text-red-400 font-medium">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-400 hover:text-red-300 transition"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

export function WarningAlert({ message, onDismiss, autoClose = false }: AlertProps) {
  return (
    <div className="fixed top-4 right-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 max-w-md shadow-lg animate-in slide-in-from-right">
      <div className="flex items-start gap-3">
        <div className="text-yellow-400 text-2xl">⚠</div>
        <div className="flex-1">
          <p className="text-yellow-400 font-medium">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-yellow-400 hover:text-yellow-300 transition"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
