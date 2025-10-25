import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type TProps = {
  data: number[];
};

export const RenderLineChart = ({ data }: TProps) => {
  const chartData =
    data &&
    data.map((el: number, i: number) => {
      return { name: i, kg: el };
    });

  return (
    <>
      {chartData && (
        <ResponsiveContainer width={'100%'} height={300}>
          <LineChart
            width={600}
            height={300}
            data={chartData}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <Line
              type='monotone'
              dataKey='kg'
              stroke='#4f46e5'
              strokeWidth={3}
            />
            <CartesianGrid stroke='#e2e8f0' strokeDasharray='3 3' />
            <XAxis
              dataKey='name'
              stroke='#64748b'
              tick={{ fill: '#374151', fontSize: 12, fontWeight: 'bold' }}
            >
              <Label
                value='Weeks'
                position='insideBottomRight'
                offset={40}
                style={{ fontWeight: 'bold', fill: '#374151' }}
              />
            </XAxis>
            <YAxis
              domain={['dataMin - 1', 'dataMax + 1']}
              stroke='#64748b'
              tick={{ fill: '#374151', fontSize: 12, fontWeight: 'bold' }}
            >
              <Label
                value='Kg.'
                position='insideTopLeft'
                offset={70}
                style={{ fontWeight: 'bold', fill: '#374151' }}
              />
            </YAxis>
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      )}
    </>
  );
};
