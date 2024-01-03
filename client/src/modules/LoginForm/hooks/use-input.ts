import { useCallback, useState } from 'react'

export const useInput = (validateFn: (arg: string) => boolean) => {
  const [enteredValue, setEnteredValue] = useState('')
  const [isTouched, setIsTouched] = useState(false)

  const valueIsValid = validateFn(enteredValue)
  const hasError = !valueIsValid && isTouched

  const valueChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setEnteredValue(e.target.value)
    },
    []
  )

  const inputBlurHandler = useCallback(() => {
    setIsTouched(true)
  }, [])

  const reset = useCallback(() => {
    setEnteredValue('')
    setIsTouched(false)
  }, [])

  return {
    value: enteredValue,
    isValid: valueIsValid,
    hasError,
    valueChangeHandler,
    inputBlurHandler,
    reset,
  }
}
