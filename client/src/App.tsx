import { observer } from 'mobx-react-lite'

import { RotatingLines } from 'react-loader-spinner'
import classes from './App.module.css'
import HomePage from './pages/HomePage'
import { useAuth } from './shared/hooks/use-auth'

const App: React.FC = () => {
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

  return <div className={classes.app}>{isAuth && <HomePage />}</div>
}

export default observer(App)
