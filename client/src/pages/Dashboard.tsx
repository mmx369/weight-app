import SimpleMovingAvg from '../modules/SimpleMovingAvg';
import { Loader } from '../shared/components';
import { useAuth } from '../shared/hooks/use-auth';
import classes from './Dashboard.module.css';

export const Dashboard: React.FC = () => {
  const { isLoading, isAuth } = useAuth();

  if (isLoading) {
    return (
      <div className={classes.app}>
        <Loader size='large' />
      </div>
    );
  }

  return <div className={classes.app}>{isAuth && <SimpleMovingAvg />}</div>;
};
