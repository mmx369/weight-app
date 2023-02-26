import { Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage'

const App = () => {
  // const [ordered, setOrdered] = useState(false)

  // const displayConfirmation = () => {
  //   setOrdered(true)

  //   setTimeout(() => {
  //     setOrdered(false)
  //   }, 3000)
  // }

  console.log('counter')

  return (
    <>
      <Container>
        <Link to='settings'>
          <i className='bi bi-gear'></i>
        </Link>
        {/* {ordered && <Confirmation setOrdered={setOrdered} />} */}
        <Row>
          <HomePage />
        </Row>
      </Container>
    </>
  )
}

export default App
