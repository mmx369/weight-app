export function getSimpleMovingAvg(weightData: number[], days = 7) {
  const simpleMovingAvgArr = []
  for (let i = 0; i < weightData.length; i++) {
    if (i < days) {
      let res = 0
      for (let j = 0; j <= i; j++) {
        res += weightData[i - j]
      }
      simpleMovingAvgArr.push((res / (i + 1)).toFixed(1))
    } else {
      let res = 0
      for (let j = 0; j <= days - 1; j++) {
        res += weightData[i - j]
      }
      simpleMovingAvgArr.push((res / days).toFixed(1))
    }
  }
  const dataEverySomeDay = simpleMovingAvgArr
    .map((el) => Number(el))
    .reverse()
    .filter((val, i) => i % days === 0)
    .reverse()
  return dataEverySomeDay
}
