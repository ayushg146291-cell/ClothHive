import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, X, Star, Trash2 } from 'lucide-react'
import { productService } from '@/services/product.service'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

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

  if (isLoading) return <div className="text-white text-center py-20">Loading reviews...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-white">Review Management</h1>
      </div>

      <div className="glass rounded-2xl overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-white/5 text-gray-300">
              <tr>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold">Rating</th>
                <th className="px-6 py-4 font-semibold">Review</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reviews.map((review: any) => (
                <motion.tr 
                  key={review.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                        {review.user.name?.[0] || 'A'}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{review.user.name}</p>
                        <p className="text-xs">{review.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white font-medium">{review.product.name}</p>
                    <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="font-bold text-white mr-1">{review.rating}</span>
                      <Star size={14} fill="#f59e0b" stroke="#f59e0b" />
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    {review.title && <p className="font-medium text-white mb-1">{review.title}</p>}
                    <p className="text-xs truncate">{review.body}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                      review.isVerified ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {review.isVerified ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {!review.isVerified && (
                        <button
                          onClick={() => approveMutation.mutate(review.id)}
                          className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                          title="Approve Review"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteMutation.mutate(review.id)}
                        className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                        title="Delete Review"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              
              {reviews.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No reviews found.
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
