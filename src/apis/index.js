import axios from 'axios'
import { API_ROOT } from '@/utils/constant'
import { toast } from 'react-toastify'
import authorizedAxiosInstance from '@/utils/authorizeAxios'

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
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users/refresh-token`)
  return response.data
}

// Google login
export const googleLoginAPI = async (googleToken) => {
  const response = await axios.post(`${API_ROOT}/v1/users/google-login`, {
    googleToken
  })
  toast.success('Đăng nhập với Google thành công!', {
    theme: 'colored'
  })
  return response.data
}

// *** Categories ***
export const getCategoriesAPI = async (searchPath) => {
  if (!searchPath) searchPath = ''
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/categories${searchPath}`)
  return response.data
}

export const getCategoryByIdAPI = async (categoryId) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/categories/${categoryId}`)
  return response.data
}

export const createCategoryAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/categories`, data)
  return response.data
}

export const updateCategoryAPI = async (categoryId, data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/categories/${categoryId}`, data)
  return response.data
}

export const deleteCategoryAPI = async (categoryId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/categories/${categoryId}`)
  return response.data
}

// BookGenres
export const getBookGenresAPI = async (searchPath) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/book-genres${searchPath}`)
  return response.data
}

export const createBookGenreAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/book-genres`, data)
  return response.data
}

export const updateBookGenreAPI = async (bookGenreId, data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/book-genres/${bookGenreId}`, data)
  return response.data
}

export const deleteBookGenreAPI = async (bookGenreId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/book-genres/${bookGenreId}`)
  return response.data
}

// Product
export const createProductAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/products`, data)
  return response.data
}

export const getCategoriesForProductAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/products/categories`)
  return response.data
}

export const getBookGenresForProductAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/products/book-genres`)
  return response.data
}

export const getProductsAPI = async (searchPath = '') => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/products${searchPath}`)
  return response.data
}

export const getProductByIdAPI = async (productId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/products/${productId}`)
  return response.data
}

export const updateProductAPI = async (productId, data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/products/${productId}`, data)
  return response.data
}

export const deleteProductAPI = async (productId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/products/${productId}`)
  return response.data
}
