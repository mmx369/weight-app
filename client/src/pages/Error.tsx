import { useRouteError } from 'react-router-dom'

export default function Error() {
  const error = useRouteError()

  let title = 'An error occured!'
  let message = 'Something went wrong!'

  //@ts-ignore
  if (error.status === 500) {
    //@ts-ignore
    message = error.data.message
  }
  //@ts-ignore
  if (error.status === 404) {
    title = 'Not found!'
    message = 'Could not find resource or page.'
  }

  return <div>{message}</div>
}
