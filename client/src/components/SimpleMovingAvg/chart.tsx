import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type TProps = {
  data: number[]
}

export const RenderLineChart = ({ data }: TProps) => {
  const chartData =
    data &&
    data.map((el: number, i: number) => {
      return { name: i, kg: el }
    })

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
            <Line type='monotone' dataKey='kg' stroke='#8884d8' />
            <CartesianGrid stroke='#ccc' strokeDasharray='3 3' />
            <XAxis dataKey='name'>
              <Label
                value='Weeks'
                position='insideBottomRight'
                offset={40}
                style={{ fontWeight: 'bold' }}
              />
            </XAxis>
            <YAxis domain={['dataMin - 1', 'dataMax + 1']}>
              <Label
                value='Kg.'
                position='insideTopLeft'
                offset={70}
                style={{ fontWeight: 'bold' }}
              />
            </YAxis>
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      )}
    </>
  )
}
