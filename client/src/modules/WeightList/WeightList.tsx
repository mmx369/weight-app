import { useContext, useEffect } from 'react'
import { Context } from '../..'
import WeightService from '../../services/WeightService'
import { IWeightData } from '../../shared/interfaces/IWeightData'
import classes from './WeightList.module.css'

export const WeightList: React.FC = () => {
  const { store } = useContext(Context)

  useEffect(() => {
    const fetchData = async () => {
      const data = await WeightService.getData()
      store.setWeightData(data)
    }
    fetchData().catch(console.error)
  }, [store])

  const weight = store.weightData

  const convertDate = (date: string) => {
    let theDate = new Date(Date.parse(date))
    return theDate.toLocaleString().split(',')[0]
  }

  if (weight.length === 0) {
    return <h2>You haven't entered your weight yet.</h2>
  }

  return (
    <div className={classes.container}>
      <div className={classes.title}>Weight Data</div>
      <div className={classes.list}>
        {weight &&
          weight.map((el: IWeightData) => (
            <div key={el._id} className={classes.item}>
              <div className={classes.content}>{`Date: ${convertDate(
                el.date
              )} | Weight: ${el.weight} kg. | ${
                el.change ? el.change.toFixed(2) + ' %' : ''
              }`}</div>
            </div>
          ))}
      </div>
    </div>
  )
}
