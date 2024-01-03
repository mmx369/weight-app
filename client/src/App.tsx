import { observer } from 'mobx-react-lite'
import { useContext, useEffect } from 'react'
import { Context } from '.'

import { RotatingLines } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import classes from './App.module.css'
import HomePage from './pages/HomePage'

const App: React.FC = () => {
  const { store } = useContext(Context)
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth()
    }
  }, [store])

  useEffect(() => {
    if (!store.isAuth && !store.isLoading) {
      navigate('/auth')
    }
  }, [store.isAuth, store.isLoading, navigate])

  if (store.isLoading) {
    return (
      <div className={classes.spinner}>
        <RotatingLines
          strokeColor='grey'
          strokeWidth='5'
          animationDuration='0.75'
          width='96'
          visible={true}
        />
      </div>
    )
  }

  return (
    <div className={classes.app}>
      <HomePage />
    </div>
  )
}

export default observer(App)
