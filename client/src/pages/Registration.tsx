import { RegistrationForm } from '../modules/RegistrationForm';
import classes from './Registration.module.css';

const Registration: React.FC = () => {
  return (
    <div className={classes.app}>
      <RegistrationForm />
    </div>
  );
};

export default Registration;
