import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '@/utils/authorizeAxios'
import { API_ROOT } from '@/utils/constant'
import { toast } from 'react-toastify'

// Khởi tạo giá trị state của một slice trong redux
const initialState = {
  currentUser: null
}

// Hành động gọi api bất đồng bộ và cập nhật dữ liệu vào redux, dùng middlenware createAsyncThunk đi kèm với extraReducers
export const loginUserAPI = createAsyncThunk(
  'user/loginUserAPI',
  async (data) => {
    const response = await authorizedAxiosInstance.post(
      `${API_ROOT}/v1/users/login`,
      data
    )

    return response.data
  }
)

export const logoutUserAPI = createAsyncThunk(
  'user/logoutUserAPI',
  async (showSuccessMessage = true) => {
    const response = await authorizedAxiosInstance.delete(
      `${API_ROOT}/v1/users/logout`
    )
    if (showSuccessMessage) {
      toast.success('Đăng xuất thành công!')
    }
    return response.data
  }
)

export const updateUserAPI = createAsyncThunk(
  'user/updateUserAPI',
  async (data) => {
    const response = await authorizedAxiosInstance.put(
      `${API_ROOT}/v1/users/update`,
      data
    )
    return response.data
  }
)

// Khởi tạo một cái slice trong kho lưu trữ redux store
export const userSlice = createSlice({
  name: 'user',
  initialState,
  // Nơi xử lý dữ liệu đồng bộ
  reducers: {},
  // ExtraReducer: nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      // action.payload ở đây là response.data
      const user = action.payload
      state.currentUser = user
    })
    builder.addCase(logoutUserAPI.fulfilled, (state) => {
      /**
       * API logout: sau khi gọi thành công thì sẽ clear thông tin currentUser về null ở đây.
       * Kết hợp ProtectedRoute đã làm ở App.js => code sẽ điều hướng chuẩn về trang Login.
       */
      state.currentUser = null
    })
    builder.addCase(updateUserAPI.fulfilled, (state, action) => {
      const user = action.payload
      state.currentUser = user
    })
  }
})

// Action là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer chạy đồng bộ
// Không có properties actions, những actions được redux tự động tạo theo reducers
// export const {} = userSlice.actions

// Selectors là nơi các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ redux store ra sử dụng
export const selectCurrentUser = (state) => {
  return state.user.currentUser
}

export const userReducer = userSlice.reducer
