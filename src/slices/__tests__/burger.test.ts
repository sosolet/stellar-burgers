import type { TConstructorIngredient, TIngredient } from '@utils-types';
import {
  burgerReducer,
  addIngredients,
  removeIngredient,
  ingredientsToUp,
  ingredientsToDown,
  clearBurger,
  IBurgerState
} from '../burger-slice';

const initialState: IBurgerState = {
  constructorItems: { bun: null, ingredients: [] },
  isIngredientsLoading: false,
  error: null
};

jest.mock('uuid', () => ({
  v4: () => 'test-uuid'
}));

const mockBun: TIngredient = {
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
};

const mockMain: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
};

const withItems = (
  bun: TConstructorIngredient | null,
  ingredients: TConstructorIngredient[]
): IBurgerState => ({
  ...initialState,
  constructorItems: { bun, ingredients }
});

describe('burgerReducer редьюсер конструктора бургера', () => {
  test('при неизвестном экшене и состоянии undefined возвращает начальное состояние', () => {
    expect(burgerReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  describe('добавление ингредиентов (addIngredients)', () => {
    test('булка записывается в поле bun и получает id', () => {
      const state = burgerReducer(initialState, addIngredients(mockBun));

      expect(state).toEqual(withItems({ ...mockBun, id: 'test-uuid' }, []));
    });

    test('начинка добавляется в список ингредиентов и получает id', () => {
      const state = burgerReducer(initialState, addIngredients(mockMain));

      expect(state).toEqual(
        withItems(null, [{ ...mockMain, id: 'test-uuid' }])
      );
    });

    test('вторая булка заменяет первую', () => {
      const other = { ...mockBun, _id: 'other-bun', name: 'Другая булка' };
      const stateWithBun = burgerReducer(initialState, addIngredients(mockBun));
      const state = burgerReducer(stateWithBun, addIngredients(other));

      expect(state.constructorItems.bun?._id).toBe('other-bun');
    });
  });

  test('removeIngredient: удаляет ингредиент по id', () => {
    const state = burgerReducer(
      withItems(null, [
        { ...mockMain, id: 'a' },
        { ...mockMain, id: 'b' }
      ]),
      removeIngredient({ ...mockMain, id: 'a' })
    );

    expect(state).toEqual(withItems(null, [{ ...mockMain, id: 'b' }]));
  });

  test('ingredientsToUp: меняет ингредиент местами с предыдущим', () => {
    const state = burgerReducer(
      withItems(null, [
        { ...mockMain, id: '1' },
        { ...mockMain, id: '2' }
      ]),
      ingredientsToUp(1)
    );

    expect(state).toEqual(
      withItems(null, [
        { ...mockMain, id: '2' },
        { ...mockMain, id: '1' }
      ])
    );
  });

  test('ingredientsToDown: меняет ингредиент местами со следующим', () => {
    const state = burgerReducer(
      withItems(null, [
        { ...mockMain, id: '1' },
        { ...mockMain, id: '2' }
      ]),
      ingredientsToDown(0)
    );

    expect(state).toEqual(
      withItems(null, [
        { ...mockMain, id: '2' },
        { ...mockMain, id: '1' }
      ])
    );
  });

  test('clearBurger: очищает булку и ингредиенты', () => {
    const state = burgerReducer(
      withItems({ ...mockBun, id: 'bun-id' }, [{ ...mockMain, id: '1' }]),
      clearBurger()
    );

    expect(state).toEqual(initialState);
  });
});
