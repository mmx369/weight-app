import { Toast } from 'react-bootstrap'

type TProps = {
  setOrdered: (x: boolean) => void
}

export const Confirmation = ({ setOrdered }: TProps) => {
  return (
    <Toast onClose={() => setOrdered(false)}>
      <Toast.Header>
        <strong className='mr-auto'>Your Order</strong>
        <small>just now</small>
      </Toast.Header>
      <Toast.Body>Your weight is ...</Toast.Body>
    </Toast>
  )
}
