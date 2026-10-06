import type { TIngredient } from '@utils-types';
import {
  ingredientsReducer,
  fetchIngredients,
  IIngredientsSlice
} from '../ingredients-slice';

const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  }
];

const initialState: IIngredientsSlice = {
  ingredients: [],
  isIngredientsLoading: false,
  error: undefined
};

describe('ingredientsReducer редьюсер списка ингредиентов', () => {
  test('при неизвестном экшене и состоянии undefined возвращает начальное состояние', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual(initialState);
  });

  describe('асинхронный экшен fetchIngredients', () => {
    test('pending: включает признак загрузки', () => {
      const state = ingredientsReducer(
        initialState,
        fetchIngredients.pending('')
      );

      expect(state).toEqual({ ...initialState, isIngredientsLoading: true });
    });

    test('fulfilled: выключает загрузку и сохраняет ингредиенты', () => {
      const state = ingredientsReducer(
        { ...initialState, isIngredientsLoading: true },
        fetchIngredients.fulfilled(mockIngredients, '')
      );

      expect(state).toEqual({
        ingredients: mockIngredients,
        isIngredientsLoading: false,
        error: undefined
      });
    });

    test('rejected: выключает загрузку и сохраняет текст ошибки', () => {
      const state = ingredientsReducer(
        { ...initialState, isIngredientsLoading: true },
        fetchIngredients.rejected(new Error('Network error'), '')
      );

      expect(state).toEqual({
        ingredients: [],
        isIngredientsLoading: false,
        error: 'Network error'
      });
    });
  });
});
