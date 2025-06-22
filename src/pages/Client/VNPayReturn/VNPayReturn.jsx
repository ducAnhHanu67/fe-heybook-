import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { formatPriceWithCurrency } from '@/utils/formatters'
import { updatePaymentStatusAPI } from '@/apis'

const VNPayReturn = () => {
  const [paymentResult, setPaymentResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const handleVNPayReturn = async () => {
      try {
        // Get all query parameters from VNPay
        const params = new URLSearchParams(searchParams.toString())

        // Extract basic info from VNPay params
        const vnpResponseCode = params.get('vnp_ResponseCode')
        const vnpTxnRef = params.get('vnp_TxnRef') // Order number
        const vnpAmount = params.get('vnp_Amount')
        const vnpTransactionNo = params.get('vnp_TransactionNo')
        const vnpPayDate = params.get('vnp_PayDate')

        if (!vnpTxnRef) {
          throw new Error('Không tìm thấy mã đơn hàng')
        }

        // Update payment status via API
        const updateResult = await updatePaymentStatusAPI(vnpTxnRef, {
          responseCode: vnpResponseCode,
          transactionNo: vnpTransactionNo,
          amount: vnpAmount,
          payDate: vnpPayDate
        })

        const result = {
          success: vnpResponseCode === '00',
          orderNumber: vnpTxnRef,
          amount: vnpAmount ? parseInt(vnpAmount) / 100 : 0,
          transactionNo: vnpTransactionNo,
          message: getResponseMessage(vnpResponseCode),
          orderData: updateResult.data
        }

        setPaymentResult(result)

        // Clean up localStorage
        localStorage.removeItem('pendingOrder')
      } catch (error) {
        // Error processing VNPay return
        setPaymentResult({
          success: false,
          message: error.message || 'Có lỗi xảy ra khi xử lý kết quả thanh toán'
        })
      } finally {
        setLoading(false)
      }
    }

    handleVNPayReturn()
  }, [searchParams])

  const getResponseMessage = (responseCode) => {
    const messages = {
      '00': 'Giao dịch thành công',
      '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
      '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
      10: 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
      11: 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
      12: 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
      13: 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.',
      24: 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
      51: 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
      65: 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
      75: 'Ngân hàng thanh toán đang bảo trì.',
      79: 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch',
      99: 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)'
    }

    return messages[responseCode] || 'Lỗi không xác định'
  }

  const handleContinue = () => {
    if (paymentResult?.orderNumber) {
      // Cả thanh toán thành công và thất bại đều có thể xem chi tiết đơn hàng
      navigate(`/thank-you?orderNumber=${paymentResult.orderNumber}`)
    } else {
      navigate('/orders')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-500" />
              <h2 className="mb-2 text-xl font-semibold">Đang xử lý kết quả thanh toán</h2>
              <p className="text-gray-600">Vui lòng chờ trong giây lát...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              {paymentResult?.success ? (
                <CheckCircle className="h-16 w-16 text-green-500" />
              ) : (
                <XCircle className="h-16 w-16 text-red-500" />
              )}
            </div>
            <CardTitle className={`text-2xl ${paymentResult?.success ? 'text-green-600' : 'text-red-600'}`}>
              {paymentResult?.success ? 'Thanh toán thành công!' : 'Thanh toán thất bại!'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentResult?.orderNumber && (
              <div className="text-center">
                <p className="text-sm text-gray-600">Mã đơn hàng</p>
                <p className="text-lg font-semibold">{paymentResult.orderNumber}</p>
              </div>
            )}

            {paymentResult?.amount > 0 && (
              <div className="text-center">
                <p className="text-sm text-gray-600">Số tiền</p>
                <p className="text-lg font-semibold text-blue-600">
                  {formatPriceWithCurrency(paymentResult.amount)}
                </p>
              </div>
            )}

            {paymentResult?.transactionNo && (
              <div className="text-center">
                <p className="text-sm text-gray-600">Mã giao dịch VNPay</p>
                <p className="font-semibold">{paymentResult.transactionNo}</p>
              </div>
            )}

            <div className="text-center">
              <p className="mb-4 text-sm text-gray-600">{paymentResult?.message}</p>

              <Button
                onClick={handleContinue}
                className="w-full"
                variant={paymentResult?.success ? 'default' : 'outline'}
              >
                {paymentResult?.orderNumber ? 'Xem chi tiết đơn hàng' : 'Về trang đơn hàng'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default VNPayReturn
