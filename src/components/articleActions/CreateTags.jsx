import { useState } from 'react'
import '../../assets/styles/CreateTags.css'
import PropTypes from 'prop-types'

export default function CreateTags({ setTags, tags }) {
  const [showInput, setShowInput] = useState(false)
  const [name, setName] = useState('')

  function onClick() {
    setShowInput((prev) => !prev)
  }

  function eventHandler(event) {
    if (event.key === 'Enter') {
      event.preventDefault()
      setTags([...tags, { id: Date.now(), name: name }])
      setName('')
    }
  }

  return (
    <div className='createTags'>
      <p>Create tags</p>
      <button type='button' onClick={onClick}>
        {showInput ? 'х' : '+'}
      </button>
      {showInput && (
        <div>
          <input
            type='text'
            name='createTag'
            id='createTagInput'
            value={name}
            onKeyDown={eventHandler}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>
      )}
    </div>
  )
}

CreateTags.propTypes = {
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  setTags: PropTypes.func.isRequired,
}
