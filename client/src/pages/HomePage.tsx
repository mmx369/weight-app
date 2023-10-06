import { Link } from 'react-router-dom'
import WeightForm from '../components/WeightForm/WeightForm'
import WeightList from '../components/WeightList/WeightList'

import classes from './HomePage.module.css'

function HomePage() {
  return (
    <div className={classes.container}>
      <WeightForm />
      <Link to={'dashboard'}>Dashboard</Link>
      <WeightList />
    </div>
  )
}

export default HomePage
