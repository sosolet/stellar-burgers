import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  getError,
  clearErrorMessage,
  fetchRegisterUser
} from '../../slices/user-slice';

export const Register: FC = () => {
  const [name, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const error = useSelector(getError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const data = { name, email, password };
    dispatch(fetchRegisterUser(data));
  };

  useEffect(() => {
    dispatch(clearErrorMessage());
  }, []);

  return (
    <RegisterUI
      errorText={error}
      email={email}
      userName={name}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
