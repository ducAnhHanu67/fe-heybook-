import axios from 'axios'
import { API_ROOT } from '@/utils/constant'
import { toast } from 'react-toastify'

/** Users */
export const registerUserAPI = async (data) => {
  const response = await axios.post(`${API_ROOT}/v1/users/register`, data)
  toast.success('Đăng ký thành công! Bạn có thể đăng nhập vào hệ thống', {
    theme: 'colored'
  })
  return response.data
}

// export const verifyUserAPI = async (data) => {
//   const response = await axios.put(`${API_ROOT}/v1/users/verify`, data)
//   toast.success(
//     'Account verified successfully! Now you can login to enjoy our services! Have a good day!',
//     {
//       theme: 'colored'
//     }
//   )
//   return response.data
// }

export const refreshTokenAPI = async () => {
  const response = await axios.get(`${API_ROOT}/v1/users/refresh_token`)
  return response.data
}

// *** Categories ***
export const getCategoriesAPI = async (searchPath) => {
  const response = await axios.get(`${API_ROOT}/v1/categories${searchPath}`)
  return response.data
}

export const getCategoryByIdAPI = async (categoryId) => {
  const response = await axios.put(`${API_ROOT}/v1/categories/${categoryId}`)
  return response.data
}

export const createCategoryAPI = async (data) => {
  const response = await axios.post(`${API_ROOT}/v1/categories`, data)
  return response.data
}

export const updateCategoryAPI = async (categoryId, data) => {
  const response = await axios.put(
    `${API_ROOT}/v1/categories/${categoryId}`,
    data
  )
  return response.data
}

export const deleteCategoryAPI = async (categoryId) => {
  const response = await axios.delete(`${API_ROOT}/v1/categories/${categoryId}`)
  return response.data
}
