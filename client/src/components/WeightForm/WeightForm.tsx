import { useContext, useState } from 'react'
import { Context } from '../..'
import WeightService from '../../services/WeightService'
import { Button } from '../UI/Button/Button'
import classes from './WeightForm.module.css'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { notify } from '../../utils/notify'

function WeightForm() {
  const { store } = useContext(Context)
  const [weightInputValue, setWeightInputValue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const weight = store.weightData

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (+weightInputValue < 1 || +weightInputValue > 200) {
      notify('Weight must be between 1 and 160 kg.', 'error')
      throw new Error('Invalid input!')
    }
    setIsSubmitting(true)
    const weightData = { weight: weightInputValue }
    await WeightService.createNewEntry(weightData)
    const res = await WeightService.getData()
    store.setWeightData(res)
    notify('Weight added succesfully!', 'success')
    setWeightInputValue('')
    setIsSubmitting(false)
  }

  const handleDelete = async () => {
    const resp = await WeightService.removeLastEntry()
    store.setWeightData(resp)
    notify('Deleted succesfully!', 'success')
  }

  return (
    <>
      <form className={classes.form}>
        <p>
          <input
            placeholder='Weight'
            id='weight'
            type='number'
            name='weight'
            value={weightInputValue}
            step={0.1}
            required
            onChange={(e) => setWeightInputValue(e.target.value)}
          />
        </p>
        <Button
          isDisabled={isSubmitting}
          typeButton='submit'
          className='btn_save'
          onClick={handleSubmit}
        >
          {isSubmitting ? 'Submitting...' : 'Add'}
        </Button>
        {weight.length !== 0 && (
          <Button
            isDisabled={isSubmitting}
            typeButton='button'
            className='btn_save'
            onClick={handleDelete}
          >
            Delete Last
          </Button>
        )}
      </form>
      <ToastContainer />
    </>
  )
}

export default WeightForm
