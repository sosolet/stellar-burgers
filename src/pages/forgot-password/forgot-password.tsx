import React, { FC, SyntheticEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { ForgotPasswordUI } from '@ui-pages';
import {
  fetchForgotPassword,
  getPasswordError,
  clearErrorMessage
} from '../../slices/password-slice';

export const ForgotPassword: FC = () => {
  const [email, setEmail] = React.useState('');
  const dispatch = useDispatch();
  const error = useSelector(getPasswordError);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearErrorMessage());
  }, [dispatch]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(fetchForgotPassword({ email }))
      .unwrap()
      .then(() => {
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password', { replace: true });
      });
  };

  return (
    <ForgotPasswordUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
