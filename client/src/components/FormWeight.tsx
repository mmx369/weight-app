import cn from 'classnames'
import { ChangeEvent, useState } from 'react'
import Select from './Select'

type TProps = {
  names: string[]
}

export const FormWeight = ({ names }: TProps) => {
  const [weight, setWeight] = useState('')
  const [name, setName] = useState('')
  const [isSelectOpen, setIsSelectOpen] = useState(false)
  const options = [{ value: name, label: name }]
  const [selectedOption, setIsSelectedOption] = useState({
    value: name,
    label: name,
  })

  console.log(1111, names)

  const handleClick = () => {
    console.log('Sending data...', weight, name)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setWeight(e.target.value)
  }

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setName(e.target.value)
  }

  return (
    <>
      <Select
        className={cn('SelectPage-Select', {
          'SelectPage-Select__active': isSelectOpen,
        })}
        options={options}
        value={selectedOption}
        // styles={SelectStyles}
        // onBlur={handleBlur}
        onChange={handleChange}
        // onFocus={handleFocus}
      />

      {/* {console.log('render')}
      Weight: {weight}
      <br />
      Name: {name}
      <Form>
        <Form.Select
          aria-label='Select-name'
          value={name}
          onChange={handleSelect}
        >
          <option>Choose your name:</option>
          {names.map((el) => (
            <option value={el} key={el}>
              {el}
            </option>
          ))}
        </Form.Select>

        <Form.Group className='mb-3' controlId='formBasicWeight'>
          <Form.Label>Enter your current weight:</Form.Label>
          <Form.Control
            type='number'
            value={weight}
            onChange={handleChange}
            placeholder='Enter your current weight here'
          />
          <Form.Text className='text-muted'>
            We'll never share your weight with anyone.
          </Form.Text>
        </Form.Group>
      </Form>
      <Button variant='primary' type='submit' onClick={handleClick}>
        Submit
      </Button> */}
    </>
  )
}
