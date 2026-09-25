import React, { FC, SyntheticEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { ResetPasswordUI } from '@ui-pages';
import {
  fetchResetPassword,
  getPasswordError,
  clearErrorMessage
} from '../../slices/password-slice';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = React.useState('');
  const [token, setToken] = React.useState('');
  const dispatch = useDispatch();
  const error = useSelector(getPasswordError);

  useEffect(() => {
    dispatch(clearErrorMessage());
  }, [dispatch]);

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      await dispatch(fetchResetPassword({ password, token })).unwrap();
      localStorage.removeItem('resetPassword');
      navigate('/login');
    } catch (error) {
      console.error('Ошибка при сбросе пароля:', error);
    }
  };

  return (
    <ResetPasswordUI
      errorText={error}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
