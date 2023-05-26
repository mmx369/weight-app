import { Form, redirect, useActionData, useNavigation } from 'react-router-dom'
import services from '../../services/services'

import classes from './WeightForm.module.css'

function WeightForm() {
  const data = useActionData() as any
  const navigation = useNavigation()

  const isSubmitting = navigation.state === 'submitting'

  return (
    <Form method='post' className={classes.form}>
      {data && data.errors && (
        <ul>
          {Object.values(data.errors).map((err) => (
            //@ts-ignore
            <li key={err}>{err}</li>
          ))}
        </ul>
      )}
      <p>
        <label htmlFor='weight'>Your Weight</label>
        <input
          id='weight'
          type='number'
          name='weight'
          step={0.1}
          min={10}
          max={160}
          required
        />
      </p>
      <div className={classes.actions}>
        <button disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Save'}
        </button>
      </div>
    </Form>
  )
}

export async function action({ request }: any) {
  const data = await request.formData()
  const weightData = {
    weight: data.get('weight'),
    name: 'Max',
  }
  await services.createNewEntry(weightData)
  return redirect('/')
}

export default WeightForm
