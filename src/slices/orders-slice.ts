import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

interface IOrdersSlice {
  orders: TOrder[];
  ordersIsLoading: boolean;
  error: string | undefined;
}

const initialState: IOrdersSlice = {
  orders: [],
  ordersIsLoading: false,
  error: undefined
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrder',
  async (number: number) => getOrderByNumberApi(number)
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  selectors: {
    getOrdersIsLoading: (state) => state.ordersIsLoading,
    getOrders: (state) => state.orders,
    getOrdersError: (state) => state.orders
  },
  extraReducers(builder) {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.ordersIsLoading = true;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.ordersIsLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.ordersIsLoading = false;
        state.orders = action.payload.orders;
      });
  }
});

export const { getOrdersIsLoading, getOrders, getOrdersError } =
  ordersSlice.selectors;

export const ordersReducer = ordersSlice.reducer;
