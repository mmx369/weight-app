import { json } from 'react-router-dom'

type TCreateChallenge = {
  name: string
  weight: string
}

const baseUrl = 'http://localhost:5000/api/weight'

const createNewEntry = async (newObject: TCreateChallenge) => {
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newObject),
    })

    if (response.status === 422) {
      return response
    }

    if (!response.ok) {
      throw json({ message: 'Could not save event.' }, { status: 500 })
    }
  } catch (error) {
    console.log('Error: ', error)
  }
}

const getData = async () => {
  try {
    const response = await fetch(baseUrl)
    if (!response.ok) {
      return json({ message: 'Could not fetch events' }, { status: 500 })
    }
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.log('Error: ', error)
  }
}

export default {
  createNewEntry,
  getData,
}
