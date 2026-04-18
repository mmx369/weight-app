import { useContext, useMemo } from 'react';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Context } from '../..';
import classes from './WeightInsights.module.css';

export const WeightInsights: React.FC = () => {
  const { store } = useContext(Context);

  const chartData = useMemo(() => {
    return [...store.weightData]
      .sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
      .map((entry) => ({
        date: new Date(entry.date).toLocaleDateString(undefined, {
          day: '2-digit',
          month: 'short',
        }),
        weight: Number(entry.weight.toFixed(2)),
      }));
  }, [store.weightData]);

  const latestEntry = store.weightData[0];
  const latestWeight = latestEntry ? latestEntry.weight : null;

  const progressData = useMemo(() => {
    if (!store.idealWeight || latestWeight === null) {
      return null;
    }

    const { min, max } = store.idealWeight;
    const center = (min + max) / 2;
    const maxDistance = Math.max(center - min, max - center);
    const distance = Math.abs(latestWeight - center);
    const normalized = Math.max(0, Math.min(100, 100 - (distance / maxDistance) * 100));

    let status = 'Above range';
    if (latestWeight < min) status = 'Below range';
    if (latestWeight >= min && latestWeight <= max) status = 'In ideal range';

    return {
      percent: Number(normalized.toFixed(0)),
      status,
      min,
      max,
    };
  }, [store.idealWeight, latestWeight]);

  return (
    <section className={classes.wrapper}>
      <article className={`${classes.card} ${classes.cardPrimary}`}>
        <div className={classes.cardHeader}>
          <p className={classes.kicker}>Trend</p>
          <h3>Weight trajectory</h3>
        </div>

        {chartData.length > 1 ? (
          <div className={classes.chartArea}>
            <ResponsiveContainer width='100%' height={170}>
              <LineChart data={chartData}>
                <XAxis
                  dataKey='date'
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip
                  cursor={{ stroke: 'rgba(255,255,255,0.25)' }}
                  contentStyle={{
                    borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(15, 23, 42, 0.88)',
                    color: '#e2e8f0',
                  }}
                />
                <Line
                  type='monotone'
                  dataKey='weight'
                  stroke='url(#weightLine)'
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 5, fill: '#8b5cf6' }}
                />
                <defs>
                  <linearGradient id='weightLine' x1='0' y1='0' x2='1' y2='0'>
                    <stop offset='0%' stopColor='#60a5fa' />
                    <stop offset='100%' stopColor='#a78bfa' />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className={classes.emptyChart}>
            <div className={classes.fakeTrendLine} />
            <p>Add 1-2 entries to unlock your weight trend</p>
          </div>
        )}
      </article>

      <article className={`${classes.card} ${classes.cardSecondary}`}>
        <div className={classes.cardHeader}>
          <p className={classes.kicker}>Goal</p>
          <h3>Progress to ideal range</h3>
        </div>

        {progressData ? (
          <>
            <div className={classes.progressMeta}>
              <span>{progressData.status}</span>
              <strong>{progressData.percent}% alignment</strong>
            </div>
            <div className={classes.progressTrack}>
              <div
                className={classes.progressFill}
                style={{ width: `${progressData.percent}%` }}
              />
            </div>
            <p className={classes.rangeText}>
              Target range: {progressData.min} - {progressData.max} kg
            </p>
          </>
        ) : (
          <div className={classes.emptyChart}>
            Complete your profile data to see goal progress.
          </div>
        )}
      </article>
    </section>
  );
};

export default WeightInsights;
