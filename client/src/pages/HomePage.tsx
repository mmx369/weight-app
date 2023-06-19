import WeightForm from '../components/WeightForm/WeightForm'
import WeightList from '../components/WeightList/WeightList'

import classes from './HomePage.module.css'

function HomePage() {
  return (
    <div className={classes.container}>
      <WeightForm />
      <WeightList />
    </div>
  )
}

export default HomePage
