import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, MapPin, Star } from 'lucide-react'
import {
  getUserAddressesAPI,
  createAddressAPI,
  updateAddressAPI,
  deleteAddressAPI,
  setDefaultAddressAPI
} from '@/apis'

// Helper: Render pagination page numbers
function renderPaginationNumbers({ totalPages, currentPage, setCurrentPage }) {
  if (!totalPages || totalPages < 2) return null
  const pages = []
  // Always show first page
  if (totalPages > 0) pages.push(1)
  // Show pages around current page
  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
    if (!pages.includes(i)) pages.push(i)
  }
  // Always show last page if more than 1 page
  if (totalPages > 1 && !pages.includes(totalPages)) pages.push(totalPages)

  return pages.map((page, index) => {
    const prevPage = pages[index - 1]
    const showEllipsis = prevPage && page - prevPage > 1
    return (
      <div key={page} className="flex items-center gap-2">
        {showEllipsis && <span className="px-2 text-gray-400">...</span>}
        <Button
          variant={currentPage === page ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCurrentPage(page)}
          className={currentPage === page ? 'bg-blue-600 text-white' : ''}
        >
          {page}
        </Button>
      </div>
    )
  })
}

export default function AddressBook() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [addressToDelete, setAddressToDelete] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    defaultValues: {
      recipientName: '',
      recipientEmail: '',
      recipientPhone: '',
      address: ''
    }
  })

  // Fetch addresses with pagination
  const {
    data: addressesData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['userAddresses', currentPage],
    queryFn: () => getUserAddressesAPI(`?page=${currentPage}&limit=10`),
    retry: 1
  })

  // Create address mutation
  const createAddressMutation = useMutation({
    mutationFn: createAddressAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userAddresses'] })
      toast.success('Thêm địa chỉ thành công!')
      setIsDialogOpen(false)
      reset()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm địa chỉ!')
    }
  })

  // Update address mutation
  const updateAddressMutation = useMutation({
    mutationFn: ({ addressId, data }) => updateAddressAPI(addressId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userAddresses'] })
      toast.success('Cập nhật địa chỉ thành công!')
      setIsDialogOpen(false)
      setEditingAddress(null)
      reset()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật địa chỉ!')
    }
  })

  // Delete address mutation
  const deleteAddressMutation = useMutation({
    mutationFn: deleteAddressAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userAddresses'] })
      toast.success('Xóa địa chỉ thành công!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa địa chỉ!')
    }
  })

  // Set default address mutation
  const setDefaultMutation = useMutation({
    mutationFn: setDefaultAddressAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userAddresses'] })
      toast.success('Đặt địa chỉ mặc định thành công!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra!')
    }
  })

  const addresses = addressesData?.data || []

  const handleOpenDialog = (address = null) => {
    if (address) {
      setEditingAddress(address)
      setValue('recipientName', address.recipientName)
      setValue('recipientEmail', address.recipientEmail)
      setValue('recipientPhone', address.recipientPhone)
      setValue('address', address.address)
    } else {
      setEditingAddress(null)
      reset()
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingAddress(null)
    reset()
  }

  const onSubmit = (data) => {
    if (editingAddress) {
      updateAddressMutation.mutate({
        addressId: editingAddress.id,
        data
      })
    } else {
      createAddressMutation.mutate(data)
    }
  }

  const handleDelete = (address) => {
    setAddressToDelete(address)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = () => {
    if (addressToDelete) {
      deleteAddressMutation.mutate(addressToDelete.id)
      setDeleteConfirmOpen(false)
      setAddressToDelete(null)
    }
  }

  const cancelDelete = () => {
    setDeleteConfirmOpen(false)
    setAddressToDelete(null)
  }

  const handleSetDefault = (addressId) => {
    setDefaultMutation.mutate(addressId)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sổ địa chỉ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <MapPin className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-500">Đang tải...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sổ địa chỉ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <MapPin className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-red-500">Có lỗi xảy ra khi tải địa chỉ</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <CardTitle>Sổ địa chỉ</CardTitle>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="h-4 w-4" />
            Thêm địa chỉ mới
          </Button>
        </CardHeader>
        <CardContent>
          {addresses.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <MapPin className="mx-auto h-16 w-16 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Chưa có địa chỉ nào</h3>
                <p className="mt-2 text-gray-500">
                  Bạn chưa có địa chỉ nào được lưu. Thêm địa chỉ đầu tiên để tiện cho việc đặt hàng.
                </p>
                <Button onClick={() => handleOpenDialog()} className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  Thêm địa chỉ mới
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">{address.recipientName}</h4>
                        {address.isDefault && (
                          <Badge variant="secondary" className="gap-1">
                            <Star className="h-3 w-3" />
                            Mặc định
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>{address.recipientPhone}</p>
                        <p>{address.recipientEmail}</p>
                        <p className="text-gray-700">{address.address}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 md:ml-4">
                      {!address.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(address.id)}
                          disabled={setDefaultMutation.isPending}
                          className="flex-1 md:flex-none"
                        >
                          Đặt mặc định
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDialog(address)}
                        className="flex-1 gap-1 md:flex-none"
                      >
                        <Edit className="h-3 w-3" />
                        Sửa
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(address)}
                        disabled={deleteAddressMutation.isPending}
                        className="flex-1 gap-1 text-red-600 hover:text-red-700 md:flex-none"
                      >
                        <Trash2 className="h-3 w-3" />
                        Xóa
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {addressesData?.pagination && addressesData.pagination.totalPages > 1 && (
            <div className="mt-6 border-t pt-4">
              <div className="mb-3 text-sm text-gray-600">
                Trang {addressesData.pagination.page} / {addressesData.pagination.totalPages} (
                {addressesData.pagination.total} địa chỉ)
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Trước
                </Button>
                {renderPaginationNumbers({
                  totalPages: addressesData.pagination.totalPages,
                  currentPage,
                  setCurrentPage
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(addressesData.pagination.totalPages, prev + 1))
                  }
                  disabled={currentPage === addressesData.pagination.totalPages}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Address Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipientName">Họ và tên *</Label>
              <Input
                id="recipientName"
                placeholder="Nhập họ và tên người nhận"
                {...register('recipientName', {
                  required: 'Họ tên không được để trống',
                  minLength: {
                    value: 2,
                    message: 'Họ tên phải có ít nhất 2 ký tự'
                  }
                })}
                className={errors.recipientName ? 'border-red-500' : ''}
              />
              {errors.recipientName && <p className="text-sm text-red-500">{errors.recipientName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipientEmail">Email *</Label>
              <Input
                id="recipientEmail"
                type="email"
                placeholder="Nhập địa chỉ email"
                {...register('recipientEmail', {
                  required: 'Email không được để trống',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Email không hợp lệ'
                  }
                })}
                className={errors.recipientEmail ? 'border-red-500' : ''}
              />
              {errors.recipientEmail && (
                <p className="text-sm text-red-500">{errors.recipientEmail.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipientPhone">Số điện thoại *</Label>
              <Input
                id="recipientPhone"
                placeholder="Nhập số điện thoại"
                {...register('recipientPhone', {
                  required: 'Số điện thoại không được để trống',
                  pattern: {
                    value: /^[0-9]{10,11}$/,
                    message: 'Số điện thoại phải có 10-11 chữ số'
                  }
                })}
                className={errors.recipientPhone ? 'border-red-500' : ''}
              />
              {errors.recipientPhone && (
                <p className="text-sm text-red-500">{errors.recipientPhone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ chi tiết *</Label>
              <Textarea
                id="address"
                placeholder="Nhập địa chỉ chi tiết (số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố)"
                rows={3}
                {...register('address', {
                  required: 'Địa chỉ không được để trống',
                  minLength: {
                    value: 10,
                    message: 'Địa chỉ quá ngắn, vui lòng nhập chi tiết'
                  }
                })}
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleCloseDialog} className="flex-1">
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={createAddressMutation.isPending || updateAddressMutation.isPending}
                className="flex-1"
              >
                {(createAddressMutation.isPending || updateAddressMutation.isPending) && (
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                )}
                {editingAddress ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa địa chỉ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              {addressToDelete?.isDefault
                ? 'Bạn có chắc chắn muốn xóa địa chỉ mặc định này? Bạn sẽ cần đặt địa chỉ mặc định mới sau khi xóa.'
                : 'Bạn có chắc chắn muốn xóa địa chỉ này?'}
            </p>
            {addressToDelete && (
              <div className="rounded-lg border bg-gray-50 p-3">
                <p className="font-medium">{addressToDelete.recipientName}</p>
                <p className="text-sm text-gray-600">{addressToDelete.recipientPhone}</p>
                <p className="text-sm text-gray-600">{addressToDelete.address}</p>
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={cancelDelete} className="flex-1">
                Hủy
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleteAddressMutation.isPending}
                className="flex-1"
              >
                {deleteAddressMutation.isPending && (
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                )}
                Xóa
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
