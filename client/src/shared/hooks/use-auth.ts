import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Context } from '../..'

export const useAuth = () => {
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

  return { isLoading: store.isLoading, isAuth: store.isAuth }
}
