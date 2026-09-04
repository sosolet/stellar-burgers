import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  TRegisterData,
  TLoginData
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../utils/cookie';

const validateRegisterData = (data: TRegisterData): string | null => {
  if (!data.email || !data.password || !data.name) {
    return 'Пожалуйста, заполните все поля';
  }
  if (data.password.length < 6) {
    return 'Пароль должен содержать минимум 6 символов';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return 'Введите корректный email';
  }
  if (data.name.length < 2) {
    return 'Имя должно содержать не менее 2 символов';
  }
  return null;
};

const validateLoginData = (data: TLoginData): string | null => {
  if (!data.email || !data.password) {
    return 'Пожалуйста, заполните все поля';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return 'Пожалуйста, введите корректный email';
  }
  if (data.password.length < 6) {
    return 'Пароль должен содержать минимум 6 символов';
  }
  return null;
};

export const fetchRegisterUser = createAsyncThunk(
  'user/fetchRegisterUser',
  async (data: TRegisterData, { rejectWithValue }) => {
    const validationError = validateRegisterData(data);
    if (validationError) {
      return rejectWithValue(validationError);
    }
    try {
      const response = await registerUserApi(data);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response;
    } catch (error: any) {
      if (error.message === 'User already exists') {
        return rejectWithValue(
          'Пользователь с таким email уже зарегистрирован'
        );
      }
      return rejectWithValue(
        'Произошла ошибка при регистрации. Пожалуйста, попробуйте позже'
      );
    }
  }
);

export const fetchLoginUser = createAsyncThunk(
  'user/fetchLoginUser',
  async (data: TLoginData, { rejectWithValue }) => {
    const validationError = validateLoginData(data);
    if (validationError) {
      return rejectWithValue(validationError);
    }
    try {
      const response = await loginUserApi(data);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response;
    } catch (error: any) {
      if (error.message === 'email or password are incorrect') {
        return rejectWithValue('Неверный email или пароль');
      }
      return rejectWithValue(
        'Произошла ошибка при входе. Пожалуйста, попробуйте позже'
      );
    }
  }
);

export const fetchGetUser = createAsyncThunk('user/fetchGetUser', async () =>
  getUserApi()
);

export const fetchUpdateUser = createAsyncThunk(
  'user/fetchUpdateUser',
  async (user: Partial<TRegisterData>) => updateUserApi(user)
);

export const fetchLogout = createAsyncThunk('user/fetchLogout', async () =>
  logoutApi().then(() => {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  })
);

interface TUserSlice {
  isAuthenticated: boolean;
  data: TUser;
  error: string | undefined;
  loginUserRequest: boolean;
}

const initialState: TUserSlice = {
  isAuthenticated: false,
  data: {
    name: '',
    email: ''
  },
  error: undefined,
  loginUserRequest: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearErrorMessage: (state) => {
      state.error = undefined;
    }
  },
  selectors: {
    getUserData: (state) => state.data,
    getIsAuthenticated: (state) => state.isAuthenticated,
    getError: (state) => state.error,
    getLoginRequest: (state) => state.loginUserRequest
  },
  extraReducers(builder) {
    builder

      .addCase(fetchRegisterUser.pending, (state) => {
        state.isAuthenticated = false;
        state.error = undefined;
      })
      .addCase(fetchRegisterUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.error =
          (action.payload as string) || 'Произошла ошибка при регистрации';
      })
      .addCase(fetchRegisterUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.data.email = action.payload.user.email;
        state.data.name = action.payload.user.name;
        state.error = undefined;
      })

      .addCase(fetchLoginUser.pending, (state) => {
        state.isAuthenticated = false;
        state.error = undefined;
      })
      .addCase(fetchLoginUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.error =
          (action.payload as string) || 'Произошла ошибка при авторизации';
      })
      .addCase(fetchLoginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.data = action.payload.user;
        state.error = undefined;
      })

      .addCase(fetchGetUser.pending, (state) => {
        state.loginUserRequest = true;
        state.isAuthenticated = false;
      })
      .addCase(fetchGetUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.isAuthenticated = false;
        state.error =
          action.error.message === 'You should be authorised'
            ? 'Пожалуйста, авторизуйтесь'
            : action.error.message === 'Invalid credentials provided'
              ? 'Неверные учетные данные'
              : action.error.message;
      })
      .addCase(fetchGetUser.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.isAuthenticated = true;
        state.loginUserRequest = false;
      })

      .addCase(fetchUpdateUser.pending, (state) => {
        state.loginUserRequest = true;
      })
      .addCase(fetchUpdateUser.rejected, (state, action) => {
        state.loginUserRequest = true;
        state.error =
          action.error.message === 'You should be authorised'
            ? 'Пожалуйста, авторизуйтесь'
            : action.error.message;
      })
      .addCase(fetchUpdateUser.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.isAuthenticated = true;
        state.loginUserRequest = false;
      })

      .addCase(fetchLogout.pending, (state) => {
        state.loginUserRequest = true;
      })
      .addCase(fetchLogout.rejected, (state, action) => {
        state.error = action.error.message;
        state.loginUserRequest = true;
      })
      .addCase(fetchLogout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.data = { name: '', email: '' };
        state.loginUserRequest = false;
      });
  }
});

export const { clearErrorMessage } = userSlice.actions;

export const { getUserData, getError, getIsAuthenticated, getLoginRequest } =
  userSlice.selectors;

export const userReducer = userSlice.reducer;
