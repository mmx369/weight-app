import { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../..';
import classes from './IdealWeightRange.module.css';

export const IdealWeightRange: React.FC = observer(() => {
  const { store } = useContext(Context);

  // Если нет информации об идеальном весе, не отображаем компонент
  if (!store.idealWeight) {
    return null;
  }

  return (
    <div className={classes.container}>
      <div className={classes.icon}>
        <svg
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
        </svg>
      </div>
      <div className={classes.content}>
        <span className={classes.label}>Ideal weight range for you:</span>
        <span className={classes.range}>{store.idealWeight.range}</span>
      </div>
    </div>
  );
});
