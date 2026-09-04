import { FC, useEffect, useMemo } from 'react';
import { Preloader, OrderInfoUI } from '@ui';
import { TIngredient } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import { fetchOrders, getOrders } from '../../slices/orders-slice';
import { useParams } from 'react-router-dom';
import { getIngredients } from '../../slices/ingredient-slice';
import styles from '../ui/order-info/order-info.module.css';

type OrderInfoProps = {
  isModal?: boolean;
};

export const OrderInfo: FC<OrderInfoProps> = ({ isModal = false }) => {
  const { number } = useParams();
  const ordersNumber = Number(number);
  const dispatch = useDispatch();
  const orders = useSelector(getOrders);
  const orderData = orders.find((order) => order);
  const ingredients: TIngredient[] = useSelector(getIngredients);

  useEffect(() => {
    dispatch(fetchOrders(ordersNumber));
  }, []);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return (
    <div className={!isModal ? `${styles.page} ${styles.standalone}` : ''}>
      {!isModal && (
        <h2 className='text text_type_digits-default mb-10'>
          #{orderInfo.number}
        </h2>
      )}
      <OrderInfoUI orderInfo={orderInfo} />
    </div>
  );
};
