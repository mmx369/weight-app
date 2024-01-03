import { useEffect, useState } from 'react'
import Button from '../../shared/UI/Button'

interface IProfileFormProps {
  onClose: () => void
  firstName?: string
  familyName?: string
  dateOfBirth?: string
  height?: number
}

interface IProfileData {
  firstName: string
  familyName: string
  dateOfBirth: string
  height: number
}

export const ProfileForm: React.FC<IProfileFormProps> = ({
  onClose,
  firstName,
  familyName,
  dateOfBirth,
  height,
}) => {
  const [profileData, setProfileData] = useState<IProfileData>({
    firstName: '',
    familyName: '',
    dateOfBirth: '',
    height: 0,
  })

  useEffect(() => {
    setProfileData({
      firstName: firstName || '',
      familyName: familyName || '',
      dateOfBirth: dateOfBirth || '',
      height: height || 0,
    })
  }, [firstName, familyName, dateOfBirth, height])

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault()
    console.log('Submitting....')
    onClose()
  }

  return (
    <div>
      <h3>Edit profile data</h3>
      <form>
        <p>
          <input
            placeholder='First Name'
            id='firstName'
            type='text'
            name='firstName'
            value={profileData.firstName}
            onChange={(e) =>
              setProfileData({ ...profileData, firstName: e.target.value })
            }
          />
        </p>
        <p>
          <input
            placeholder='Family Name'
            id='familyName'
            type='text'
            name='familyName'
            value={profileData.familyName}
            onChange={(e) =>
              setProfileData({ ...profileData, familyName: e.target.value })
            }
          />
        </p>
        <p>
          <input
            placeholder='Date of Birth'
            id='dateOfBirth'
            type='date'
            name='dateOfBirth'
            value={profileData.dateOfBirth}
            onChange={(e) =>
              setProfileData({ ...profileData, dateOfBirth: e.target.value })
            }
          />
        </p>
        <p>
          <input
            placeholder='Height'
            id='height'
            type='number'
            name='height'
            step={1}
            value={profileData.height}
            onChange={(e) =>
              setProfileData({
                ...profileData,
                height: parseInt(e.target.value),
              })
            }
          />
        </p>

        <Button typeButton='submit' className='btn_save' onClick={handleSubmit}>
          Submit
        </Button>
      </form>
    </div>
  )
}
