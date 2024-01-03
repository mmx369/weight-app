import { useContext, useEffect, useState } from 'react'
import { RotatingLines } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import { Context } from '..'

import ProfileForm from '../modules/ProfileForm'
import Button from '../shared/UI/Button'
import Modal from '../shared/UI/Modal'
import classes from './Profile.module.css'

export const Profile: React.FC = () => {
  const { store } = useContext(Context)
  const navigate = useNavigate()

  const [isModalOpen, setModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  console.log(5555)
  console.log(JSON.parse(JSON.stringify(store)))

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

  const openModal = () => {
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  const handleSubmit = () => {
    openModal()
    console.log('Submitting...')
  }

  const handleSubmitData = () => {
    closeModal()
  }

  return (
    <div className={classes.container}>
      <h1>Profile page</h1>
      <div>
        <div>First Name: {store.user.firstName}</div>
        <div>Family Name: {store.user.familyName}</div>
        <div>Date of Birth: {store.user.dateOfBirth?.toString()}</div>
        <div>Height: {store.user.height}</div>
      </div>

      <Modal show={isModalOpen}>
        <ProfileForm
          onClose={closeModal}
          firstName={store.user.firstName}
          familyName={store.user.familyName}
          dateOfBirth={store.user.dateOfBirth?.toString()}
          height={store.user.height}
        />
        <Button
          typeButton='submit'
          className='btn_save'
          onClick={handleSubmitData}
        >
          Close
        </Button>
      </Modal>

      <Button
        isDisabled={isSubmitting}
        typeButton='submit'
        className='btn_save'
        onClick={handleSubmit}
      >
        {isSubmitting ? 'Submitting...' : 'Change'}
      </Button>
    </div>
  )
}
