'use client'

export function SkeletonCard({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 animate-pulse">
          <div className="h-6 bg-zinc-800 rounded w-3/4 mb-4" />
          <div className="space-y-3">
            <div className="h-4 bg-zinc-800 rounded w-full" />
            <div className="h-4 bg-zinc-800 rounded w-5/6" />
            <div className="h-4 bg-zinc-800 rounded w-4/6" />
          </div>
        </div>
      ))}
    </>
  )
}

export function SkeletonChart() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 animate-pulse">
      <div className="h-6 bg-zinc-800 rounded w-1/3 mb-6" />
      <div className="w-full h-64 bg-zinc-800 rounded mb-4" />
      <div className="flex gap-4">
        <div className="flex-1 h-12 bg-zinc-800 rounded" />
        <div className="flex-1 h-12 bg-zinc-800 rounded" />
      </div>
    </div>
  )
}

export function SkeletonForm() {
  return (
    <div className="space-y-4 animate-pulse">
      <div>
        <div className="h-4 bg-zinc-800 rounded w-1/4 mb-2" />
        <div className="h-10 bg-zinc-800 rounded" />
      </div>
      <div>
        <div className="h-4 bg-zinc-800 rounded w-1/4 mb-2" />
        <div className="h-10 bg-zinc-800 rounded" />
      </div>
      <div className="h-10 bg-zinc-800 rounded w-full" />
    </div>
  )
}
