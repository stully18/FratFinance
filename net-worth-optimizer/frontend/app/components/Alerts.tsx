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
    <div className="fixed top-4 right-4 bg-zinc-900 border-l-4 border-green-500 rounded-lg p-4 max-w-md shadow-2xl shadow-black/40 animate-fade-in-up z-50">
      <div className="flex items-start gap-3">
        <div className="text-green-500 text-lg">&#10003;</div>
        <div className="flex-1">
          <p className="text-zinc-200 text-sm font-medium">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
          >
            &#10005;
          </button>
        )}
      </div>
    </div>
  )
}

export function ErrorAlert({ message, onDismiss, autoClose = false }: AlertProps) {
  return (
    <div className="fixed top-4 right-4 bg-zinc-900 border-l-4 border-red-500 rounded-lg p-4 max-w-md shadow-2xl shadow-black/40 animate-fade-in-up z-50">
      <div className="flex items-start gap-3">
        <div className="text-red-500 text-lg">&#10005;</div>
        <div className="flex-1">
          <p className="text-zinc-200 text-sm font-medium">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
          >
            &#10005;
          </button>
        )}
      </div>
    </div>
  )
}

export function WarningAlert({ message, onDismiss, autoClose = false }: AlertProps) {
  return (
    <div className="fixed top-4 right-4 bg-zinc-900 border-l-4 border-amber-500 rounded-lg p-4 max-w-md shadow-2xl shadow-black/40 animate-fade-in-up z-50">
      <div className="flex items-start gap-3">
        <div className="text-amber-500 text-lg">&#9888;</div>
        <div className="flex-1">
          <p className="text-zinc-200 text-sm font-medium">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
          >
            &#10005;
          </button>
        )}
      </div>
    </div>
  )
}
