import { Button, Card } from 'react-bootstrap'

type TProps = {
  el: number
  setOrdered: (x: boolean) => void
}

export const CardWeight = ({ el, setOrdered }: TProps) => {
  return (
    <Card className='h-100 shadow-sm bg-white rounded'>
      Card Number {el}
      <Button
        onClick={() => setOrdered(true)}
        className='mt-auto font-weight-bold'
        variant='success'
      >
        ddddd
      </Button>
    </Card>
  )
}
