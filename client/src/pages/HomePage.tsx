import { useContext, useEffect, useState } from 'react';
import { Context } from '..';
import WeightService from '../services/WeightService';
import WeightForm from '../modules/WeightForm';
import WeightInsights from '../modules/WeightInsights/WeightInsights';
import WeightList from '../modules/WeightList';
import { Loader } from '../shared/components';
import { useAuth } from '../shared/hooks/use-auth';
import classes from './HomePage.module.css';

const HomePage: React.FC = () => {
  const PAGE_LIMIT = 10;
  const { store } = useContext(Context);
  const { isAuth, isLoading: authLoading } = useAuth();
  const [isInitialDataLoading, setIsInitialDataLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      if (!isAuth) return;
      try {
        setIsInitialDataLoading(true);
        const result = await WeightService.getData(1, PAGE_LIMIT);
        if (result.data && result.pagination) {
          store.setWeightData(result.data, result.pagination, result.idealWeight);
        } else {
          store.setWeightData(result);
        }
      } catch (error) {
        store.setWeightData([]);
      } finally {
        setIsInitialDataLoading(false);
      }
    };

    loadInitialData();
  }, [isAuth, store]);

  // При первой загрузке оставляем header, а в зоне контента показываем только loader.
  if (authLoading || isInitialDataLoading) {
    return (
      <div className={classes.loadingContainer}>
        <Loader size='large' />
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <WeightInsights />
      <WeightForm />
      <WeightList />
    </div>
  );
};

export default HomePage;
