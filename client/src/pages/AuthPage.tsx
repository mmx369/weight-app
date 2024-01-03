import LoginForm from '../modules/LoginForm'
import classes from './AuthPage.module.css'

const AuthPage: React.FC = () => {
  return (
    <div className={classes.app}>
      <LoginForm />
    </div>
  )
}

export default AuthPage
