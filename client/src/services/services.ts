import axios from 'axios'

type TCreateChallenge = {
  name: string
  currentWeight: string
  targetWeight: string
  targetDate: string
}

const baseUrl = 'http://localhost:5000/api/setchallenge'

const createChallenge = async (newObject: TCreateChallenge) => {
  try {
    return await axios.post(baseUrl, newObject)
  } catch (error) {
    console.log('Error: ', error)
  }
}

const removeChallengeData = async (id: any) => {
  try {
    return await axios.delete(`${baseUrl}/${id}`)
  } catch (error) {
    console.log('Error: ', error)
  }
}

const getChallengeData = async () => {
  try {
    const resp = await axios.get(baseUrl)
    if (!resp.data) {
      return [
        {
          name: '',
          currentWeight: '',
          targetWeight: '',
          targetDate: '',
        },
      ]
    }
    return resp.data
  } catch (error) {
    console.log('Error: ', error)
  }
}

const getStatistics = async () => {
  console.log(111)
}

const getNames = async () => {
  const resp = await axios.get(`${baseUrl}/names`)
  return resp.data
}

export default {
  createChallenge,
  getChallengeData,
  removeChallengeData,
  getNames,
}
