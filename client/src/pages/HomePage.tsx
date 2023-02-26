import { useLoaderData } from 'react-router-dom'
import WeightForm from '../components/WeightForm'
import WeightList from '../components/WeightList'
import services from '../services/services'

export interface Weight {
  _id: string
  name: string
  weight: number
  date: string
}

export default function HomePage() {
  const weightList = useLoaderData() as Weight[]
  return (
    <>
      <div>HOME PAGE</div>
      <WeightForm />
      <WeightList weight={weightList} />
    </>
  )
}

export async function loader() {
  const response = await services.getData()
  return response
}
