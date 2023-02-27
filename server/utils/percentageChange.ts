export function percentageChange(oldValue: number, newValue: number) {
  const absoluteChange = newValue - oldValue
  const change = absoluteChange / oldValue
  const percentageChange = change * 100
  return percentageChange.toFixed(2)
}
