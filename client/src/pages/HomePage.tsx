import { useLoaderData } from 'react-router-dom'
import WeightForm from '../components/WeightForm/WeightForm'
import WeightList from '../components/WeightList'
import services from '../services/services'

import classes from './HomePage.module.css'

export interface Weight {
  _id: string
  name: string
  weight: number
  change?: number
  date: string
}

export default function HomePage() {
  const weightList = useLoaderData() as Weight[]
  return (
    <div className={classes.container}>
      <WeightForm />
      <WeightList weight={weightList} />
    </div>
  )
}

export async function loader() {
  const response = await services.getData()
  return response
}
