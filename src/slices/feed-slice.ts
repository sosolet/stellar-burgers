import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsApi } from '@api';

interface IfeedSlice {
  orders: TOrder[];
  total: number;
  totalToday: number;
  feedIsLoading: boolean;
  error: string | undefined;
}

const initialState: IfeedSlice = {
  orders: [],
  total: 0,
  totalToday: 0,
  feedIsLoading: false,
  error: undefined
};

export const fetchFeed = createAsyncThunk(
  'feed/fetchFeed',
  async () => await getFeedsApi()
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    getFeedOrders: (state) => state.orders,
    getFeedTotal: (state) => state.total,
    getFeedTotalToday: (state) => state.totalToday,
    getFeedIsLoading: (state) => state.feedIsLoading
  },
  extraReducers(builder) {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.feedIsLoading = true;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.feedIsLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.feedIsLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      });
  }
});

export const {
  getFeedOrders,
  getFeedTotal,
  getFeedTotalToday,
  getFeedIsLoading
} = feedSlice.selectors;

export const feedReducer = feedSlice.reducer;
