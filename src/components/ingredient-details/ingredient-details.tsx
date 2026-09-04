import { FC } from 'react';
import { Preloader, IngredientDetailsUI } from '@ui';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import styles from '../ui/ingredient-details/ingredient-details.module.css';

type IngredientDetailsProps = {
  isModal?: boolean;
};

export const IngredientDetails: FC<IngredientDetailsProps> = ({
  isModal = false
}) => {
  const { ingredients } = useSelector((store) => store.ingredients);
  const { id } = useParams();
  const ingredientData = ingredients.find(
    (ingredient) => ingredient._id === id
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return (
    <div className={!isModal ? `${styles.content} ${styles.standalone}` : ''}>
      {!isModal && (
        <h2 className='text text_type_main-large mb-5'>Детали ингредиента</h2>
      )}
      <IngredientDetailsUI ingredientData={ingredientData} />
    </div>
  );
};
