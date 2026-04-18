import { useContext, useState } from 'react';
import { Context } from '../..';
import WeightService from '../../services/WeightService';
import Button from '../../shared/UI/Button';
import { IdealWeightRange } from '../IdealWeightRange';
import classes from './WeightForm.module.css';

import { notify } from '../../shared/helper/notify';

export const WeightForm: React.FC = () => {
  const PAGE_LIMIT = 10;
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
      const createResult = await WeightService.createNewEntry(weightData);

      // После добавления загружаем первую страницу с текущими настройками пагинации
      const res = await WeightService.getData(1, PAGE_LIMIT);
      if (res.data && res.pagination) {
        store.setWeightData(res.data, res.pagination, res.idealWeight);
      } else {
        store.setWeightData(res);
      }

      const feedbackMessage =
        createResult?.data?.feedback?.message || 'Weight added successfully!';
      const feedbackType =
        createResult?.data?.feedback?.type === 'warn'
          ? 'warn'
          : createResult?.data?.feedback?.type === 'info'
          ? 'info'
          : 'success';

      notify(feedbackMessage, feedbackType);
      setWeightInputValue('');
    } catch (error: any) {
      const serverMessage = error?.response?.data?.message as string | undefined;
      const isDuplicateForToday =
        serverMessage?.includes('already added your weight today') ||
        error?.response?.data?.code === 'WEIGHT_ENTRY_ALREADY_EXISTS_FOR_TODAY';

      notify(
        isDuplicateForToday
          ? 'You have already entered your weight for today. Try again tomorrow.'
          : serverMessage || error.message || 'Failed to add weight',
        'error'
      );
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
    </>
  );
};
