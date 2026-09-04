import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router';
import { ReactElement } from 'react';
import { Preloader } from '@ui';
import {
  getIsAuthenticated,
  getLoginRequest,
  getUserData
} from '../../slices/user-slice';

type ProtectedRouteProps = {
  auth?: boolean;
  children: ReactElement;
};

export const ProtectedRoute = ({
  auth = false,
  children
}: ProtectedRouteProps): ReactElement => {
  const isAuthChecked = useSelector(getIsAuthenticated);
  const loginRequested = useSelector(getLoginRequest);
  const user = useSelector(getUserData).name;
  const location = useLocation();
  const from = location.state?.from || { pathname: '/' };

  if (!isAuthChecked && loginRequested) {
    return <Preloader />;
  }

  if (auth && user) {
    return <Navigate replace to={from} state={location} />;
  }

  if (!auth && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return children;
};
