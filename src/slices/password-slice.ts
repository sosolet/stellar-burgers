import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { forgotPasswordApi, resetPasswordApi } from '@api';

interface TPasswordSlice {
  error: string | undefined;
  isRequesting: boolean;
}

const initialState: TPasswordSlice = {
  error: undefined,
  isRequesting: false
};

export const fetchForgotPassword = createAsyncThunk(
  'password/fetchForgotPassword',
  async (data: { email: string }, { rejectWithValue }) => {
    try {
      const response = await forgotPasswordApi(data);
      if (!response.success) {
        return rejectWithValue('Ошибка восстановление пароля');
      }
      return response;
    } catch (error: any) {
      if (error.message === 'Email not found') {
        return rejectWithValue('Пользователя с таким email не существует');
      }
      if (error.status === 404) {
        return rejectWithValue('Пользователя с таким email не существует');
      }
      return rejectWithValue('Ошибка восстановление пароля');
    }
  }
);

export const fetchResetPassword = createAsyncThunk(
  'password/fetchResetPassword',
  async (data: { password: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await resetPasswordApi(data);
      if (!response.success) {
        return rejectWithValue('Ошибка при сбросе пароля');
      }
      return response;
    } catch (error: any) {
      if (error.status === 404) {
        return rejectWithValue('Срок действия кода восстановления истек');
      }
      if (error.status === 401) {
        return rejectWithValue('Необходима повторная авторизация');
      }
      if (error.message === 'Invalid token') {
        return rejectWithValue('Неверный код восстановления');
      }
      if (error.message === 'Token expired') {
        return rejectWithValue('Срок действия кода восстановления истек');
      }
      return rejectWithValue('Произошла ошибка при сбросе пароля');
    }
  }
);

const passwordSlice = createSlice({
  name: 'password',
  initialState,
  reducers: {
    clearErrorMessage: (state) => {
      state.error = undefined;
    }
  },
  selectors: {
    getPasswordError: (state) => state.error,
    getIsRequesting: (state) => state.isRequesting
  },
  extraReducers(builder) {
    builder
      .addCase(fetchForgotPassword.pending, (state) => {
        state.isRequesting = true;
        state.error = undefined;
      })
      .addCase(fetchForgotPassword.rejected, (state, action) => {
        state.isRequesting = false;
        state.error =
          (action.payload as string) ||
          'Произошла ошибка при восстановлении пароля';
      })
      .addCase(fetchForgotPassword.fulfilled, (state) => {
        state.isRequesting = false;
        state.error = undefined;
      })
      .addCase(fetchResetPassword.pending, (state) => {
        state.isRequesting = true;
        state.error = undefined;
      })
      .addCase(fetchResetPassword.rejected, (state, action) => {
        state.isRequesting = false;
        state.error =
          (action.payload as string) || 'Произошла ошибка при сбросе пароля';
      })
      .addCase(fetchResetPassword.fulfilled, (state) => {
        state.isRequesting = false;
        state.error = undefined;
      });
  }
});

export const { clearErrorMessage } = passwordSlice.actions;

export const { getPasswordError, getIsRequesting } = passwordSlice.selectors;

export const passwordReducer = passwordSlice.reducer;
