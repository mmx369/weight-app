import { useEffect, useState } from 'react';
import WeightService from '../../services/WeightService';
import classes from './SimpleMovingAvg.module.css';
import { RenderLineChart } from './chart';
import { useAuth } from '../../shared/hooks/use-auth';
import { Loader } from '../../shared/components';
import {
  IWeightMetrics,
  IWeightTrendPoint,
  TTrendPeriod,
} from '../../shared/interfaces/IWeightData';

export const SimpleMovingAvg: React.FC = () => {
  const [trendPoints, setTrendPoints] = useState<IWeightTrendPoint[]>([]);
  const [metrics, setMetrics] = useState<IWeightMetrics | null>(null);
  const [period, setPeriod] = useState<TTrendPeriod>('90d');
  const [showWeightLine, setShowWeightLine] = useState(true);
  const [showSmaLine, setShowSmaLine] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuth } = useAuth();

  const periodOptions: { id: TTrendPeriod; label: string }[] = [
    { id: '30d', label: '30D' },
    { id: '90d', label: '90D' },
    { id: '180d', label: '180D' },
    { id: '1y', label: '1Y' },
    { id: 'all', label: 'All' },
  ];

  const formatWeight = (value: number | null) => {
    if (value === null || value === undefined) return 'N/A';
    return `${value.toFixed(1)} kg`;
  };

  const formatPercent = (value: number | null) => {
    if (value === null || value === undefined) return 'N/A';
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  const formatDate = (value: string | null) => {
    if (!value) return 'N/A';
    return new Date(value).toLocaleDateString();
  };

  const formatIdealStatus = (status: IWeightMetrics['idealStatus']) => {
    if (!status) return 'N/A';
    if (status === 'within') return 'Within ideal range';
    if (status === 'below') return 'Below ideal range';
    return 'Above ideal range';
  };

  useEffect(() => {
    if (!isAuth) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [trendResponse, metricsData] = await Promise.all([
          WeightService.getTrend(period),
          WeightService.getMetrics(),
        ]);
        setTrendPoints(trendResponse.points);
        setMetrics(metricsData);
      } catch (error: any) {
        console.error('Failed to fetch dashboard metrics:', error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isAuth, period]);

  if (isLoading) {
    return (
      <div className={classes.chartLoading}>
        <Loader size='medium' />
      </div>
    );
  }

  if (!metrics || metrics.totalEntries === 0) {
    return (
      <div>
        <div className={classes.title}>
          <h4>Weight Analytics</h4>
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
          <p>Add your first weight entry to unlock personalized analytics.</p>
        </div>
      </div>
    );
  }

  const metricCards = [
    { label: 'Current Weight', value: formatWeight(metrics.latestWeight) },
    { label: 'Start Weight', value: formatWeight(metrics.startWeight) },
    { label: 'Total Change', value: formatWeight(metrics.totalChangeKg) },
    { label: 'Total Change %', value: formatPercent(metrics.totalChangePercent) },
    { label: 'Average Weight', value: formatWeight(metrics.averageWeight) },
    { label: 'Median Weight', value: formatWeight(metrics.medianWeight) },
    { label: 'Min Weight', value: formatWeight(metrics.minWeight) },
    { label: 'Max Weight', value: formatWeight(metrics.maxWeight) },
    { label: 'Weekly Trend', value: formatWeight(metrics.averageWeeklyChangeKg) },
    { label: 'Biggest Drop', value: formatWeight(metrics.biggestDropKg) },
    { label: 'Biggest Gain', value: formatWeight(metrics.biggestGainKg) },
    { label: 'BMI', value: metrics.currentBmi ? metrics.currentBmi.toFixed(1) : 'N/A' },
    { label: 'Ideal Range Status', value: formatIdealStatus(metrics.idealStatus) },
    {
      label: 'Distance To Ideal',
      value:
        metrics.distanceToIdealKg === null
          ? 'N/A'
          : `${metrics.distanceToIdealKg.toFixed(1)} kg`,
    },
    { label: 'Entries', value: String(metrics.totalEntries) },
    { label: 'Tracking Days', value: String(metrics.trackingDays) },
    { label: 'First Entry', value: formatDate(metrics.firstEntryDate) },
    { label: 'Latest Entry', value: formatDate(metrics.lastEntryDate) },
  ];

  return (
    <div className={classes.dashboardWrapper}>
      <div className={classes.title}>
        <h4>Weight Analytics</h4>
      </div>

      <div className={classes.metricsGrid}>
        {metricCards.map((card) => (
          <div key={card.label} className={classes.metricCard}>
            <p className={classes.metricLabel}>{card.label}</p>
            <p className={classes.metricValue}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className={classes.chartSection}>
        <div className={classes.chartHeader}>
          <h4>Weight Trend</h4>

          <div className={classes.chartControls}>
            <div className={classes.periodGroup}>
              {periodOptions.map((option) => (
                <button
                  key={option.id}
                  className={`${classes.periodButton} ${
                    period === option.id ? classes.periodButtonActive : ''
                  }`}
                  onClick={() => setPeriod(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className={classes.toggleGroup}>
              <label className={classes.toggleItem}>
                <input
                  type='checkbox'
                  checked={showWeightLine}
                  onChange={(e) => setShowWeightLine(e.target.checked)}
                />
                <span>Weight</span>
              </label>
              <label className={classes.toggleItem}>
                <input
                  type='checkbox'
                  checked={showSmaLine}
                  onChange={(e) => setShowSmaLine(e.target.checked)}
                />
                <span>SMA (7d)</span>
              </label>
            </div>
          </div>
        </div>

        {!showWeightLine && !showSmaLine ? (
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
            <p>Select at least one line to display on the chart.</p>
          </div>
        ) : trendPoints.length < 2 ? (
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
            <p>The trend chart will appear after 2+ weight entries.</p>
          </div>
        ) : (
          <RenderLineChart
            data={trendPoints}
            showWeight={showWeightLine}
            showSma={showSmaLine}
          />
        )}
      </div>
    </div>
  );
};
