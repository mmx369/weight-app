import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../..';

export const useAuth = () => {
  const { store } = useContext(Context);
  const navigate = useNavigate();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      // Проверяем, есть ли токен, но не вызываем checkAuth сразу после логина
      const token = localStorage.getItem('token');
      if (token && !store.isAuth && !store.justLoggedIn) {
        await store.checkAuth();
      }
      setIsInitializing(false);
    };

    initializeAuth();
  }, [store]);

  useEffect(() => {
    if (!isInitializing && !store.isAuth && !store.isLoading) {
      navigate('/auth');
    }
  }, [store.isAuth, store.isLoading, isInitializing, navigate]);

  return {
    isLoading: store.isLoading || isInitializing,
    isAuth: store.isAuth,
  };
};
