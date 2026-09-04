import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

const randomId = () => crypto.randomUUID();

export interface IBurgerState {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  isIngredientsLoading: boolean;
  error: string | null;
}

const initialState: IBurgerState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  isIngredientsLoading: false,
  error: null
};

const burgerSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    addIngredients: {
      reducer: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
        if (payload.type === 'bun') {
          state.constructorItems.bun = payload;
        } else {
          state.constructorItems.ingredients.push(payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: randomId() }
      })
    },
    ingredientsToUp: (state, { payload }: PayloadAction<number>) => {
      const currentIngredient = state.constructorItems.ingredients[payload];
      const prevIngredient = state.constructorItems.ingredients[payload - 1];

      state.constructorItems.ingredients.splice(
        payload - 1,
        2,
        currentIngredient,
        prevIngredient
      );
    },
    ingredientsToDown: (state, { payload }: PayloadAction<number>) => {
      const currentIngredient = state.constructorItems.ingredients[payload];
      const nextIngredient = state.constructorItems.ingredients[payload + 1];

      state.constructorItems.ingredients.splice(
        payload,
        2,
        nextIngredient,
        currentIngredient
      );
    },
    removeIngredient: (
      state,
      { payload }: PayloadAction<TConstructorIngredient>
    ) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => ingredient.id != payload.id
        );
    },
    clearBurger: (state) => {
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];
      state.isIngredientsLoading = false;
    }
  },
  selectors: {
    getBurger: (state) => state,
    getItems: (state) => state.constructorItems,
    getBun: (state) => state.constructorItems.bun,
    getIngredients: (state) => state.constructorItems.ingredients
  }
});

export const burgerReducer = burgerSlice.reducer;

export const { getBurger, getItems, getBun, getIngredients } =
  burgerSlice.selectors;

export const {
  addIngredients,
  ingredientsToUp,
  ingredientsToDown,
  removeIngredient,
  clearBurger
} = burgerSlice.actions;
