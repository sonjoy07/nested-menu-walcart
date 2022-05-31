import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CategoryState {
  data: any;
}

const initialState: CategoryState = {
  data: null,
};

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategoryList: (state, action: PayloadAction<object>) => {
      state.data = action.payload;
    },
    addCategoryList: (state, action: PayloadAction<object>) => {
      const payload = action.payload
      state.data.categories = [
        payload,
        ...state.data.categories,
      ]
    },
    updateCategoryList: (state, action: PayloadAction<object>) => {
      const payload: any = action.payload
      const itemIndex = state.data.categories.findIndex((cat:any) => cat.uid === payload.uid);
      if(itemIndex > -1){
        state.data.categories[itemIndex] = {
            ...state.data.categories[itemIndex],
            ...payload,
        }
      }
    },
  },
});

export const { setCategoryList,addCategoryList,updateCategoryList } = categorySlice.actions;

export default categorySlice.reducer;
