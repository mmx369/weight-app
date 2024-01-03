import { Link } from 'react-router-dom'
import WeightForm from '../modules/WeightForm'
import WeightList from '../modules/WeightList'
import classes from './HomePage.module.css'

const HomePage: React.FC = () => {
  return (
    <div className={classes.container}>
      <Link to={'dashboard'} className={classes.btn}>
        Dashboard
      </Link>
      <WeightForm />
      <WeightList />
    </div>
  )
}

export default HomePage
