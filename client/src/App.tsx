import { observer } from 'mobx-react-lite';

import classes from './App.module.css';
import HomePage from './pages/HomePage';
import { useAuth } from './shared/hooks/use-auth';

const App: React.FC = () => {
  const { isAuth } = useAuth();

  return <div className={classes.app}>{isAuth && <HomePage />}</div>;
};

export default observer(App);
