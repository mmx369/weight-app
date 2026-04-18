import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { IWeightTrendPoint } from '../../shared/interfaces/IWeightData';

type TProps = {
  data: IWeightTrendPoint[];
  showWeight: boolean;
  showSma: boolean;
};

const formatDateLabel = (value: string) =>
  new Date(value).toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
  });

export const RenderLineChart = ({ data, showWeight, showSma }: TProps) => {
  const chartData = data.map((point) => ({
    ...point,
    dateLabel: formatDateLabel(point.date),
  }));

  return (
    <ResponsiveContainer width={'100%'} height={340}>
      <LineChart
        width={600}
        height={340}
        data={chartData}
        margin={{ top: 8, right: 18, bottom: 8, left: 4 }}
      >
        <CartesianGrid stroke='#e2e8f0' strokeDasharray='3 3' />
        <XAxis
          dataKey='dateLabel'
          stroke='#64748b'
          tick={{ fill: '#334155', fontSize: 12, fontWeight: 600 }}
          minTickGap={24}
        />
        <YAxis
          stroke='#64748b'
          tick={{ fill: '#334155', fontSize: 12, fontWeight: 600 }}
          domain={['dataMin - 1', 'dataMax + 1']}
          tickFormatter={(value) => `${value}kg`}
        />
        <Tooltip
          formatter={(value: number, name: string) => [
            `${Number(value).toFixed(2)} kg`,
            name === 'weight' ? 'Weight' : 'SMA (7d)',
          ]}
          labelFormatter={(_, payload) => {
            const point = payload?.[0]?.payload as { date?: string } | undefined;
            return point?.date
              ? new Date(point.date).toLocaleDateString()
              : '';
          }}
        />
        {showWeight && (
          <Line
            type='monotone'
            dataKey='weight'
            stroke='#4f46e5'
            strokeWidth={3}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            name='weight'
          />
        )}
        {showSma && (
          <Line
            type='monotone'
            dataKey='sma7'
            stroke='#0ea5e9'
            strokeWidth={3}
            strokeDasharray='5 5'
            dot={false}
            activeDot={{ r: 5 }}
            name='sma7'
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};
