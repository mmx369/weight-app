import { useContext, useState } from 'react';
import { Context } from '../..';
import WeightService from '../../services/WeightService';
import Button from '../../shared/UI/Button';
import { IdealWeightRange } from '../IdealWeightRange';
import classes from './WeightForm.module.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { notify } from '../../shared/helper/notify';

export const WeightForm: React.FC = () => {
  const { store } = useContext(Context);
  const [weightInputValue, setWeightInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!weightInputValue.trim()) {
      notify('Please enter a weight value', 'error');
      return;
    }

    const weightValue = parseFloat(weightInputValue);

    if (isNaN(weightValue)) {
      notify('Please enter a valid number', 'error');
      return;
    }

    if (weightValue < 1 || weightValue > 200) {
      notify('Weight must be between 1 and 200 kg', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const weightData = { weight: weightValue.toString() };
      await WeightService.createNewEntry(weightData);

      // После добавления загружаем первую страницу с текущими настройками пагинации
      const res = await WeightService.getData(1, store.weightPagination.limit);
      if (res.data && res.pagination) {
        store.setWeightData(res.data, res.pagination, res.idealWeight);
      } else {
        store.setWeightData(res);
      }

      notify('Weight added successfully!', 'success');
      setWeightInputValue('');
    } catch (error: any) {
      notify(error.message || 'Failed to add weight', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form className={classes.form}>
        <IdealWeightRange />
        <p>
          <input
            placeholder='Weight'
            id='weight'
            type='number'
            name='weight'
            value={weightInputValue}
            step={0.1}
            required
            onChange={(e) => setWeightInputValue(e.target.value)}
          />
        </p>
        <Button
          isDisabled={isSubmitting}
          typeButton='submit'
          className='btn_save'
          onClick={handleSubmit}
        >
          {isSubmitting ? 'Submitting...' : 'Add'}
        </Button>
      </form>
      <ToastContainer />
    </>
  );
};
