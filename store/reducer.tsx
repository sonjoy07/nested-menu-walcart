import { createSlice, PayloadAction } from '@reduxjs/toolkit'


export interface CategoryState {
  data: any
}

const initialState: CategoryState = {
  data: null,
}

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategoryList: (state, action: PayloadAction<object>) => {
      state.data = action.payload
    },
  },
})

export const { setCategoryList } = categorySlice.actions

export default categorySlice.reducer