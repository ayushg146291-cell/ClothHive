export default function ProductSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--color-gray-800)' }}>
      <div className="aspect-[3/4] shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-20 rounded shimmer" />
        <div className="h-4 w-full rounded shimmer" />
        <div className="h-4 w-3/4 rounded shimmer" />
        <div className="h-5 w-24 rounded shimmer" />
      </div>
    </div>
  )
}
