import { useState } from 'react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createReviewAPI, updateReviewAPI } from '@/apis'
import { toast } from 'react-toastify'

export default function ReviewForm({
  productId,
  existingReview = null,
  onSuccess = () => {},
  onCancel = () => {}
}) {
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState(existingReview?.comment || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleStarClick = (starRating) => {
    setRating(starRating)
  }

  const handleStarHover = (starRating) => {
    setHoveredRating(starRating)
  }

  const handleStarLeave = () => {
    setHoveredRating(0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (rating === 0) {
      toast.error('Vui lòng chọn số sao đánh giá!')
      return
    }

    setIsSubmitting(true)

    try {
      const reviewData = {
        productId,
        rating,
        comment: comment.trim()
      }

      if (existingReview) {
        // Cập nhật đánh giá
        await updateReviewAPI(existingReview.id, {
          rating,
          comment: comment.trim()
        })
        toast.success('Cập nhật đánh giá thành công!')
      } else {
        // Tạo đánh giá mới
        await createReviewAPI(reviewData)
        toast.success('Đánh giá sản phẩm thành công!')
      }

      onSuccess()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra!')
    } finally {
      setIsSubmitting(false)
    }
  }

  const displayRating = hoveredRating || rating

  return (
    <Card>
      <CardHeader>
        <CardTitle>{existingReview ? 'Chỉnh sửa đánh giá' : 'Viết đánh giá'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating Stars */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Đánh giá của bạn *</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 transition-colors"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={handleStarLeave}
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= displayRating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {rating > 0 && (
                  <>
                    {rating} sao
                    {rating === 1 && ' - Rất tệ'}
                    {rating === 2 && ' - Tệ'}
                    {rating === 3 && ' - Bình thường'}
                    {rating === 4 && ' - Tốt'}
                    {rating === 5 && ' - Tuyệt vời'}
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Nhận xét (tùy chọn)</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              rows={4}
              maxLength={1000}
            />
            <div className="mt-1 text-right text-xs text-gray-500">{comment.length}/1000</div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting || rating === 0}>
              {isSubmitting
                ? existingReview
                  ? 'Đang cập nhật...'
                  : 'Đang gửi...'
                : existingReview
                  ? 'Cập nhật'
                  : 'Gửi đánh giá'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
