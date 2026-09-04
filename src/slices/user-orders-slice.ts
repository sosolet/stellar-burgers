import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';
import { stat } from 'fs';

interface IUserOrdersResponse {
  orders: TOrder[];
}

interface IUserOrdersSlice {
  userOrders: TOrder[];
  userOrdersIsLoading: boolean;
  error: string | undefined;
}

const initialState: IUserOrdersSlice = {
  userOrders: [],
  userOrdersIsLoading: false,
  error: undefined
};

export const fetchUserOrdersApi = createAsyncThunk<IUserOrdersResponse>(
  'userOrders/fetchUserOrdersApi',
  async () => {
    const orders = await getOrdersApi();
    return { orders };
  }
);

const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {},
  selectors: {
    getUserOrdersIsLoading: (state) => state.userOrdersIsLoading,
    getUserOrders: (state) => state.userOrders,
    getUserOrdersError: (state) => state.error
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUserOrdersApi.pending, (state) => {
        state.userOrdersIsLoading = true;
      })
      .addCase(fetchUserOrdersApi.rejected, (state, action) => {
        state.userOrdersIsLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUserOrdersApi.fulfilled, (state, action) => {
        state.userOrdersIsLoading = false;
        state.userOrders = action.payload.orders;
      });
  }
});

export const { getUserOrdersIsLoading, getUserOrders, getUserOrdersError } =
  userOrdersSlice.selectors;

export const userOrdersReducer = userOrdersSlice.reducer;
