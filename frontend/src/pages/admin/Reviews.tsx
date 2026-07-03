import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, X, Star, Trash2 } from 'lucide-react'
import { productService } from '@/services/product.service'
import { toast } from 'sonner'

export default function AdminReviews() {
  const queryClient = useQueryClient()

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: productService.getAdminReviews,
  })

  const approveMutation = useMutation({
    mutationFn: (id: string) => productService.approveReview(id),
    onSuccess: () => {
      toast.success('Review approved')
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productService.deleteReview(id),
    onSuccess: () => {
      toast.success('Review deleted')
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] })
    }
  })

  if (isLoading) return <div className="text-foreground text-center py-20 text-[10px] font-bold uppercase tracking-widest">LOADING REVIEWS...</div>

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between pb-6 border-b-2 border-foreground">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-foreground">Review Management</h1>
      </div>

      <div className="border border-border bg-background">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-foreground">
            <thead className="bg-muted text-[10px] font-black uppercase tracking-widest text-foreground">
              <tr>
                <th className="px-8 py-6">USER</th>
                <th className="px-8 py-6">PRODUCT</th>
                <th className="px-8 py-6">RATING</th>
                <th className="px-8 py-6">REVIEW</th>
                <th className="px-8 py-6">STATUS</th>
                <th className="px-8 py-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review: any) => (
                <tr 
                  key={review.id}
                  className="hover:bg-muted transition-colors border-b border-border"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 border border-foreground bg-background text-foreground flex items-center justify-center font-black text-sm uppercase">
                        {review.user?.name?.[0] || 'A'}
                      </div>
                      <div>
                        <p className="font-black text-sm uppercase tracking-widest text-foreground">{review.user?.name || 'ANONYMOUS'}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{review.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black uppercase tracking-widest text-foreground mb-1">{review.product?.name || 'UNKNOWN PRODUCT'}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center">
                      <span className="font-black text-lg tracking-widest text-foreground mr-2">{review.rating}</span>
                      <Star size={16} strokeWidth={2.5} className="text-foreground" fill="currentColor" />
                    </div>
                  </td>
                  <td className="px-8 py-6 max-w-xs">
                    {review.title && <p className="font-black text-sm uppercase tracking-widest text-foreground mb-2">{review.title}</p>}
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground truncate">{review.body}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 border text-[10px] font-black uppercase tracking-widest ${
                      review.isVerified ? 'border-foreground text-foreground' : 'border-muted-foreground text-muted-foreground'
                    }`}>
                      {review.isVerified ? 'APPROVED' : 'PENDING'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-4">
                      {!review.isVerified && (
                        <button
                          onClick={() => approveMutation.mutate(review.id)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          title="Approve Review"
                        >
                          <Check size={18} strokeWidth={2.5} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteMutation.mutate(review.id)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        title="Delete Review"
                      >
                        <Trash2 size={18} strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {reviews.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    NO REVIEWS FOUND.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
