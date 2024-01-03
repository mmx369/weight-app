import { useEffect, useState } from 'react'
import WeightService from '../../services/WeightService'
import classes from './SimpleMovingAvg.module.css'
import { RenderLineChart } from './chart'

export const SimpleMovingAvg: React.FC = () => {
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
      <div className={classes.title}>
        <h4>Simple Moving Avarage (7 days)</h4>
      </div>
      <RenderLineChart data={movingAvg || []} />
    </div>
  )
}
