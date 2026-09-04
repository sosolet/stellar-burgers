import { configureStore, combineReducers } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { feedReducer } from '../slices/feed-slice';
import { ingredientsReducer } from '../slices/ingredient-slice';
import { ordersReducer } from '../slices/orders-slice';
import { burgerReducer } from '../slices/burger-slice';
import { currentOrderReducer } from '../slices/current-order-slice';
import { passwordReducer } from '../slices/password-slice';
import { userOrdersReducer } from '../slices/user-orders-slice';
import { userReducer } from '../slices/user-slice';

const rootReducer = combineReducers({
  feed: feedReducer,
  ingredients: ingredientsReducer,
  orders: ordersReducer,
  burger: burgerReducer,
  currentOrder: currentOrderReducer,
  password: passwordReducer,
  userOrders: userOrdersReducer,
  user: userReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
