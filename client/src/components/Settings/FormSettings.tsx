import { ChangeEvent, useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import apiServices from '../../services/services'

export interface IChallengeData {
  name: string
  currentWeight: string
  targetWeight: string
  targetDate: string
  _id?: string
}

export const FormSettings = () => {
  const [input, setInput] = useState<IChallengeData>({
    name: '',
    currentWeight: '',
    targetWeight: '',
    targetDate: '',
  })

  const [challengeData, setChallengeData] = useState<IChallengeData[]>([])
  const [reload, setReload] = useState(true)

  console.log(111, challengeData)

  useEffect(() => {
    apiServices
      .getChallengeData()
      .then((resp) => setChallengeData(resp))
      .catch((e) => console.log(e))
  }, [reload])

  const handleClick = async () => {
    await apiServices.createChallenge(input)
    setInput({
      name: '',
      currentWeight: '',
      targetWeight: '',
      targetDate: '',
    })
    setReload(!reload)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const handleRemove = async (id: string) => {
    await apiServices.removeChallengeData(id)
    setReload(!reload)
  }

  return (
    <>
      <ul>
        {challengeData?.map((el) => (
          <li key={el._id}>
            <strong>{`Name: ${el.name}`} </strong>
            <br />
            {`Current Weight: ${el.currentWeight} Target Weight: ${
              el.targetWeight
            } Target Date: ${el.targetDate.split('T')[0]}`}
            &nbsp;
            <Button
              onClick={() => handleRemove(el._id!)}
              size='sm'
              variant='outlined'
            >
              remove
            </Button>
          </li>
        ))}
      </ul>
      <Form>
        <Form.Group className='mb-3' controlId='formBasicWeight'>
          <Form.Label>Enter actor name:</Form.Label>
          <Form.Control
            type='text'
            name='name'
            placeholder='Enter name'
            value={input.name}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='formBasicWeight'>
          <Form.Label>Enter current weight:</Form.Label>
          <Form.Control
            type='number'
            name='currentWeight'
            placeholder='Enter current weight'
            value={input.currentWeight}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='formBasicWeight'>
          <Form.Label>Enter target weight:</Form.Label>
          <Form.Control
            type='number'
            name='targetWeight'
            placeholder='Enter target weight'
            value={input.targetWeight}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='formBasicWeight'>
          <Form.Label>Enter target date:</Form.Label>
          <Form.Control
            type='date'
            name='targetDate'
            placeholder='Enter target date'
            value={input.targetDate}
            onChange={handleChange}
          />
        </Form.Group>
      </Form>
      <Button variant='primary' type='submit' onClick={handleClick}>
        Add New Actor
      </Button>
    </>
  )
}
