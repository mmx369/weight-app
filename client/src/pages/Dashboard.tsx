import { RotatingLines } from 'react-loader-spinner'

import SimpleMovingAvg from '../modules/SimpleMovingAvg'
import { useAuth } from '../shared/hooks/use-auth'
import classes from './Dashboard.module.css'

export const Dashboard: React.FC = () => {
  const { isLoading, isAuth } = useAuth()

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

  return <div className={classes.app}>{isAuth && <SimpleMovingAvg />}</div>
}
