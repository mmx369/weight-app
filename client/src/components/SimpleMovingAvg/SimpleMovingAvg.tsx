import { useEffect, useState } from 'react'
import WeightService from '../../services/WeightService'
import { RenderLineChart } from './chart'

export const SimpleMovingAvg = () => {
  const [movingAvg, setMovingAvg] = useState<number[] | undefined>()

  useEffect(() => {
    const fetchData = async () => {
      const data = (await WeightService.getSimpleMovingAvgData()) as number[]
      setMovingAvg(data)
    }
    fetchData().catch(console.error)
  }, [])
  return (
    <div>
      <h3>Simple Moving Avarage (7 days)</h3>
      <RenderLineChart data={movingAvg || []} />
    </div>
  )
}
