import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';

interface IIngredientsSlice {
  ingredients: TIngredient[];
  isIngredientsLoading: boolean;
  error: string | undefined;
}

const initialState: IIngredientsSlice = {
  ingredients: [],
  isIngredientsLoading: false,
  error: undefined
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => await getIngredientsApi()
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    getIngredients: (state) => state.ingredients,
    getIngredientsLoading: (state) => state.isIngredientsLoading,
    getIngredientsError: (state) => state.error
  },
  extraReducers(builder) {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isIngredientsLoading = true;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isIngredientsLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isIngredientsLoading = false;
        state.ingredients = action.payload;
      });
  }
});

export const { getIngredients, getIngredientsLoading, getIngredientsError } =
  ingredientsSlice.selectors;

export const ingredientsReducer = ingredientsSlice.reducer;
