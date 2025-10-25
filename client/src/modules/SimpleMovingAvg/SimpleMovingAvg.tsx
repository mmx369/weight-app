import { useEffect, useState } from 'react';
import WeightService from '../../services/WeightService';
import classes from './SimpleMovingAvg.module.css';
import { RenderLineChart } from './chart';
import { useAuth } from '../../shared/hooks/use-auth';
import { Loader } from '../../shared/components';

export const SimpleMovingAvg: React.FC = () => {
  const [movingAvg, setMovingAvg] = useState<number[] | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const { isAuth } = useAuth();

  useEffect(() => {
    if (!isAuth) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = (await WeightService.getSimpleMovingAvgData()) as number[];
        setMovingAvg(data);
      } catch (error: any) {
        console.error('Failed to fetch moving average data:', error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isAuth]);

  if (isLoading) {
    return (
      <div>
        <div className={classes.title}>
          <h4>Simple Moving Average (7 days)</h4>
        </div>
        <Loader size='medium' />
      </div>
    );
  }

  // Проверяем, достаточно ли данных для построения графика
  if (!movingAvg || movingAvg.length < 2) {
    return (
      <div>
        <div className={classes.title}>
          <h4>Simple Moving Average (7 days)</h4>
        </div>
        <div className={classes.noDataMessage}>
          <div className={classes.icon}>
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M3 3v18h18' />
              <path d='M18.7 8l-5.1 5.2-2.8-2.7L7 14.3' />
            </svg>
          </div>
          <p>Chart will be available after 2 weeks of data entry</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={classes.title}>
        <h4>Simple Moving Average (7 days)</h4>
      </div>
      <RenderLineChart data={movingAvg || []} />
    </div>
  );
};
