import { useQuery } from '@tanstack/react-query'
import { getCartAPI } from '@/apis'
import { ShoppingCart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const CartIcon = ({ className = '' }) => {
  const navigate = useNavigate()
  const currentUser = useSelector((state) => state.user.currentUser)

  const { data: cart } = useQuery({
    queryKey: ['cart'],
    queryFn: getCartAPI,
    retry: 1,
    enabled: !!currentUser, // Only fetch when user is logged in
    refetchOnWindowFocus: false
  })

  const itemCount = cart?.items?.length || 0

  return (
    <Button variant="ghost" size="sm" onClick={() => navigate('/cart')} className={`relative ${className}`}>
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center p-0 text-xs"
        >
          {itemCount > 99 ? '99+' : itemCount}
        </Badge>
      )}
    </Button>
  )
}

export default CartIcon
