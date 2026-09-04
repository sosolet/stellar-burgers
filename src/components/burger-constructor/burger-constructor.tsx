import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { getBun, getIngredients, clearBurger } from '../../slices/burger-slice';
import { getIsAuthenticated } from '../../slices/user-slice';
import {
  fetchOrderBurgerApi,
  clearOrder,
  getOrderIsLoading,
  getOrder
} from '../../slices/current-order-slice';
import { BurgerConstructorUI } from '@ui';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const bun = useSelector(getBun);
  const ingredients = useSelector(getIngredients);
  const constructorItems = { bun, ingredients };
  const orderIsLoading = useSelector(getOrderIsLoading);
  const orderModalData = useSelector(getOrder);
  const isAuthenticated = useSelector(getIsAuthenticated);

  const onOrderClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/' } });
      return;
    }
    if (!bun) {
      return;
    }
    const orderData = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];
    dispatch(fetchOrderBurgerApi(orderData));
  };

  const closeOrderModal = () => {
    dispatch(clearBurger());
    dispatch(clearOrder());
    navigate('/');
  };

  const price = bun
    ? bun.price * 2 + ingredients.reduce((acc, item) => acc + item.price, 0)
    : 0;

  return (
    <BurgerConstructorUI
      price={price}
      constructorItems={constructorItems}
      orderRequest={orderIsLoading}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
