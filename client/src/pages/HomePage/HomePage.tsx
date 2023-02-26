import { useEffect, useState } from 'react'
import { FormWeight } from '../../components/FormWeight'
import Layout from '../../components/Layout'
import apiServices from '../../services/services'

import './HomePage.scss'

export default function HomePage() {
  const [names, setNames] = useState([])

  useEffect(() => {
    apiServices
      .getNames()
      .then((data) => setNames(data))
      .catch((e) => console.log(e))
  }, [])

  return (
    <Layout>
      <div className='HomePage'>
        <FormWeight names={names} />
      </div>
    </Layout>
  )
}
