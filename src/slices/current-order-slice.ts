import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';

interface ICurrentOrderSlice {
  order: TOrder | null;
  orderIsLoading: boolean;
  error: string | undefined;
}

const initialState: ICurrentOrderSlice = {
  order: null,
  orderIsLoading: false,
  error: undefined
};

export const fetchOrderBurgerApi = createAsyncThunk(
  'currentOrder/fetchOrderBurgerApi',
  async (data: string[]) => orderBurgerApi(data)
);

const currentOrderSlice = createSlice({
  name: 'currentOrder',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.orderIsLoading = false;
    }
  },
  selectors: {
    getOrderIsLoading: (state) => state.orderIsLoading,
    getOrder: (state) => state.order
  },
  extraReducers(builder) {
    builder
      .addCase(fetchOrderBurgerApi.pending, (state) => {
        state.orderIsLoading = true;
      })
      .addCase(fetchOrderBurgerApi.rejected, (state, action) => {
        state.orderIsLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchOrderBurgerApi.fulfilled, (state, action) => {
        state.orderIsLoading = false;
        state.order = action.payload.order;
      });
  }
});

export const { clearOrder } = currentOrderSlice.actions;

export const { getOrderIsLoading, getOrder } = currentOrderSlice.selectors;

export const currentOrderReducer = currentOrderSlice.reducer;
