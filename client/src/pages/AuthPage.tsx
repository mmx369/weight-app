import LoginForm from '../components/LoginForm/LoginForm'
import classes from './AuthPage.module.css'

function AuthPage() {
  return (
    <div className={classes.app}>
      <LoginForm />
    </div>
  )
}

export default AuthPage
