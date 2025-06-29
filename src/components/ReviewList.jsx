import { useState, useEffect, useCallback } from 'react'
import { Star, Edit, Trash2, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { getProductReviewsAPI, deleteReviewAPI } from '@/apis'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/redux/userSlice'
import { toast } from 'react-toastify'
import ReviewForm from './ReviewForm'

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
            }`}
        />
      ))}
    </div>
  )
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function ReviewList({
  productId,
  onReviewsUpdate = () => { },
  onUserReviewDeleted = () => { },
  currentUserId
}) {
  const [reviews, setReviews] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [editingReview, setEditingReview] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false)
  const itemsPerPage = 5
  const MAX_VISIBLE_REVIEWS = 2

  const currentUser = useSelector(selectCurrentUser)

  const fetchReviews = useCallback(
    async (page = 1) => {
      try {
        const response = await getProductReviewsAPI(productId, page, itemsPerPage)
        setReviews(response.data)
        setTotalPages(Math.ceil(response.count / itemsPerPage))
        onReviewsUpdate(response.count)
      } catch {
        // console.error('Error fetching reviews:', error)
        toast.error('Không thể tải đánh giá!')
      }
    },
    [productId, itemsPerPage, onReviewsUpdate]
  )

  useEffect(() => {
    fetchReviews(currentPage)
  }, [fetchReviews, currentPage])

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleEditReview = (review) => {
    setEditingReview(review)
  }

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
      return
    }

    try {
      // Tìm review để check xem có phải của currentUser không
      const reviewToDelete = reviews.find((r) => r.id === reviewId)
      const isCurrentUserReview = reviewToDelete && reviewToDelete.user?.id === currentUserId

      await deleteReviewAPI(reviewId)
      toast.success('Xóa đánh giá thành công!')

      // Nếu user xóa đánh giá của chính mình, thông báo cho parent component
      if (isCurrentUserReview) {
        onUserReviewDeleted()
      }

      fetchReviews(currentPage)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra!')
    }
  }

  const handleReviewSuccess = () => {
    setEditingReview(null)
    fetchReviews(currentPage)
  }

  const handleCancelEdit = () => {
    setEditingReview(null)
  }

  if (editingReview) {
    return (
      <ReviewForm
        productId={productId}
        existingReview={editingReview}
        onSuccess={handleReviewSuccess}
        onCancel={handleCancelEdit}
      />
    )
  }

  return (
    <div className="space-y-4">
      {(showAllReviews ? reviews : reviews.slice(0, MAX_VISIBLE_REVIEWS)).map((review) => (
        <Card key={review.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex flex-1 items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.user?.avatar} />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {review.user?.userName || 'Người dùng'}
                    </span>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="mb-2 text-sm text-gray-600">{formatDate(review.created_at)}</p>
                  {review.comment && <p className="leading-relaxed text-gray-700">{review.comment}</p>}
                </div>
              </div>

              {currentUser && currentUser.id === review.user?.id && (
                <div className="ml-2 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditReview(review)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteReview(review.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {reviews.length > MAX_VISIBLE_REVIEWS && (
        <div className="text-center mt-2">
          {showAllReviews ? (
            <button
              className="text-blue-600 hover:underline text-sm"
              onClick={() => setShowAllReviews(false)}
            >
              Ẩn bớt
            </button>
          ) : (
            <button
              className="text-blue-600 hover:underline text-sm"
              onClick={() => setShowAllReviews(true)}
            >
              Xem thêm
            </button>
          )}
        </div>
      )}

    </div>

  )
}
