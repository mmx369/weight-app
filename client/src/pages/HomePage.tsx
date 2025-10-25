import WeightForm from '../modules/WeightForm';
import WeightList from '../modules/WeightList';
import { Loader } from '../shared/components';
import { useAuth } from '../shared/hooks/use-auth';
import classes from './HomePage.module.css';

const HomePage: React.FC = () => {
  const { isAuth, isLoading: authLoading } = useAuth();

  // Показываем лоадер только пока идет аутентификация
  if (authLoading) {
    return <Loader size='large' fullscreen={true} />;
  }

  return (
    <div className={classes.container}>
      <WeightForm />
      <WeightList />
    </div>
  );
};

export default HomePage;
