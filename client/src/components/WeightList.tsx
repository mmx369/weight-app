import { Weight } from '../pages/HomePage'

import classes from './WeightList.module.css'

type TProps = {
  weight: Weight[]
}

export default function WeightList({ weight }: TProps) {
  const convertDate = (date: string) => {
    let theDate = new Date(Date.parse(date))
    return theDate.toLocaleString()
  }

  return (
    <div className={classes.weights}>
      <h1>Weight List</h1>
      <ul className={classes.list}>
        {weight &&
          weight.map((el: Weight) => (
            <li key={el._id} className={classes.item}>
              <div className={classes.content}>{`${el.name}, ${convertDate(
                el.date
              )}, ${el.weight}`}</div>
            </li>
          ))}
      </ul>
    </div>
  )
}
