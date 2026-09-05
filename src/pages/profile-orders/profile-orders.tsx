import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getUserOrders,
  fetchUserOrdersApi
} from '../../slices/user-orders-slice';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector(getUserOrders);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserOrdersApi());
  }, []);

  return <ProfileOrdersUI orders={orders} />;
};
