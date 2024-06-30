import { useContext, useState } from 'react'
import { RotatingLines } from 'react-loader-spinner'

import { Context } from '..'
import ProfileForm from '../modules/ProfileForm'
import Button from '../shared/UI/Button'
import Modal from '../shared/UI/Modal'
import { useAuth } from '../shared/hooks/use-auth'
import classes from './Profile.module.css'

export const Profile: React.FC = () => {
  const { store } = useContext(Context)
  const { isLoading, isAuth } = useAuth()

  const [isModalOpen, setModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  console.log(5555)

  if (isLoading) {
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
    { isAuth } && (
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
  )
}
