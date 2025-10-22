import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  token: string | null
  email: string | null
  first_name: string | null
  last_name: string | null
  profile_image: string | null
}

const initialState: AuthState = { token: null, email: null, first_name: null, last_name: null, profile_image: null }

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    setProfile: (state, action: PayloadAction<{ email: string; first_name: string; last_name: string; profile_image: string }>) => {
      state.email = action.payload.email
      state.first_name = action.payload.first_name
      state.last_name = action.payload.last_name
      state.profile_image = action.payload.profile_image
    },
    clearToken: (state) => {
      state.token = null
      state.email = null
      state.first_name = null
      state.last_name = null
      state.profile_image = null
    },
  },
})

export const { setToken, setProfile, clearToken } = authSlice.actions
export default authSlice.reducer
