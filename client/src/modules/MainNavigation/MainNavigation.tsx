import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../..';
import { ROUTES } from '../../routes';
import Button from '../../shared/UI/Button';
import { ProfileDropdown } from '../../shared/UI';
import classes from './MainNavigation.module.css';

export const MainNavigation: React.FC = () => {
  const { store } = useContext(Context);
  const navigate = useNavigate();

  const logoutHandler = () => {
    store.logout();
    navigate('/auth');
  };

  return (
    <>
      <header className={classes.header}>
        <Link to={ROUTES.HOME} className={classes.navlink}>
          <h3>My Weight App</h3>
        </Link>
        {store.isAuth && (
          <div className={classes.header_title}>
            Welcome {store.user.firstName || store.user.email}!
          </div>
        )}
        <div style={{ flexGrow: 1 }}></div>
        <div className={classes.header_logo}>
          <ProfileDropdown isAuth={store.isAuth} />
        </div>
        {store.isAuth && <Button onClick={logoutHandler}>Log out</Button>}
      </header>
    </>
  );
};
