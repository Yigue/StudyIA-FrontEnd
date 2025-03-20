import { useEffect } from 'react';
import { useAuthActions } from '../../hook/userAuth';

export const AuthInitializer = () => {
  const { checkAuth } = useAuthActions();

  useEffect(() => {
    checkAuth();
  }, []);

  return null;
};
