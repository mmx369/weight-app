import { useEffect, useState } from 'react'
import WeightService from '../../services/WeightService'

export const SimpleMovingAvg = () => {
  const [movingAvg, setMovingAvg] = useState<number[] | undefined>()

  useEffect(() => {
    const fetchData = async () => {
      const data = (await WeightService.getSimpleMovingAvgData()) as number[]
      console.log(1112, data)
      setMovingAvg(data)
    }
    fetchData().catch(console.error)
  }, [])
  return (
    <div>
      SimpleMovingAvg
      {movingAvg &&
        movingAvg.map((el, i) => (
          <ul key={i + el}>
            <li>{el}</li>
          </ul>
        ))}
    </div>
  )
}
