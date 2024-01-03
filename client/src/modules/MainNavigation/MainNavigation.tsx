import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Context } from '../..'
import { ROUTES } from '../../routes'
import Button from '../../shared/UI/Button'
import classes from './MainNavigation.module.css'
import ProfileLogo from './assets/profile.svg'

export const MainNavigation: React.FC = () => {
  const { store } = useContext(Context)
  const navigate = useNavigate()

  const logoutHandler = () => {
    store.logout()
    navigate('/auth')
  }

  return (
    <>
      <header className={classes.header}>
        <Link to={ROUTES.HOME} className={classes.navlink}>
          <h3>My Weight App</h3>
        </Link>
        <div style={{ flexGrow: 1 }}></div>
        <div className={classes.header_title}>
          {store.isAuth ? `Welcome ${store.user.email}!` : null}
        </div>
        <div className={classes.header_logo}>
          {store.isAuth ? (
            <Link to={ROUTES.PROFILE} className={classes.navlink}>
              <div style={{ border: 'none', width: '28px', height: '28px' }}>
                <img src={ProfileLogo} alt='React Logo' />
              </div>
            </Link>
          ) : null}
        </div>
        {store.isAuth && <Button onClick={logoutHandler}>Log out</Button>}
      </header>
    </>
  )
}
