import { observer } from 'mobx-react-lite'
import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Context } from '../..'
import Button from '../UI/Button'
import classes from './MainNavigation.module.css'

function MainNavigation() {
  const { store } = useContext(Context)
  const navigate = useNavigate()

  const logoutHandler = () => {
    store.logout()
    navigate('/auth')
  }

  return (
    <>
      <header className={classes.header}>
        <Link to={'/'} className={classes.navlink}>
          <h3>My Weight App</h3>
        </Link>
        <div style={{ flexGrow: 1 }}></div>
        <div className={classes.header_title}>
          {store.isAuth ? `Welcome ${store.user.email}!` : null}
        </div>
        {store.isAuth && <Button onClick={logoutHandler}>Log out</Button>}
      </header>
    </>
  )
}

export default observer(MainNavigation)
