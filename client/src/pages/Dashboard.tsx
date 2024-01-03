import { useContext, useEffect } from 'react'
import { RotatingLines } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import { Context } from '..'

import SimpleMovingAvg from '../modules/SimpleMovingAvg'
import classes from './Dashboard.module.css'

export const Dashboard: React.FC = () => {
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
      <SimpleMovingAvg />
    </div>
  )
}
