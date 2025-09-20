import '../../assets/styles/Settings.css'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import setCookie from '../../assets/helperFunctions/setCookie'
import PropTypes from 'prop-types'

export default function Settings({
  setPleaseLoginMessage,
  loggedInToken,
  userData,
  setToken,
  setUserData,
}) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    clearErrors,
  } = useForm()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [successUpdate, setSuccessUpdate] = useState('')

  const username = userData?.username || ''
  const email = userData?.email || ''
  const bio = userData?.bio || ''
  const avatar = userData?.image || ''

  async function onSubmit(data) {
    setIsLoading(true)
    let response

    try {
      response = await fetch('https://realworld.habsida.net/api/user', {
        method: 'PUT',
        headers: {
          Authorization: `Token ${loggedInToken}`,
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          username: data.username,
          bio: data.bio,
          image: data.avatar,
          email: data.email,
        }),
      })
      const result = await response.json()
      if (!response.ok) throw { status: response.status, result }
      setUserData(result.user)
      setSuccessUpdate('Your information was updated')
      setTimeout(() => {
        setSuccessUpdate('')
      }, 1000)
    } catch (error) {
      if (error.status === 401) {
        setPleaseLoginMessage(<div className='login-message'>Please login first!</div>)
        setTimeout(() => {
          setPleaseLoginMessage(null)
        }, 1000)
        return navigate('/sign-in')
      }
      return setError('root', {
        type: 'server',
        message: 'Something went wrong!',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='settings'>
      <div className='settings__inner'>
        <h1>Your Settings</h1>
        {successUpdate && <p className='success-message'>{successUpdate}</p>}
        <form
          onSubmit={handleSubmit((data) => {
            if (
              data.username === userData?.username &&
              data.email === userData?.email &&
              data.bio === userData?.bio &&
              data.avatar === userData?.image
            ) {
              return
            }
            onSubmit(data)
          })}
        >
          {/*username */}
          {errors.username && <p className='error'>{errors.username.message}</p>}
          <input
            type='text'
            {...register('username', {
              minLength: {
                value: 1,
                message: 'Please enter username',
              },
            })}
            name='username'
            aria-label='username'
            placeholder='Username'
            defaultValue={username}
            id='settings-username'
            onChange={() => {
              if (errors.root) {
                clearErrors(['root'])
              }
            }}
          />

          {/*email */}
          {errors.email && <p className='error'>{errors.email.message}</p>}
          <input
            type='email'
            {...register('email', {
              minLength: {
                value: 1,
                message: 'Please enter email',
              },
              pattern: {
                value: /^([a-zA-Z\d.]+)@([a-zA-Z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/,
                message: 'Please enter a valid email address',
              },
            })}
            name='email'
            aria-label='email'
            placeholder='Email'
            id='settings-email'
            defaultValue={email}
            onChange={() => {
              if (errors.root) {
                clearErrors(['root'])
              }
            }}
          />

          {/*bio */}
          {errors.bio && <p className='error'>{errors.bio.message}</p>}
          <textarea
            name='bio'
            {...register('bio')}
            aria-label='profile-info'
            placeholder='Additional info about you...'
            id='settings-info'
            rows={10}
            defaultValue={bio}
            onChange={() => {
              if (errors.root) {
                clearErrors(['root'])
              }
            }}
          ></textarea>

          {/*avatar */}
          {errors.avatar && <p className='error'>{errors.avatar.message}</p>}
          <input
            type='text'
            name='avatar'
            {...register('avatar')}
            placeholder='Avatar Image(URL)'
            aria-label='settings-avatar'
            id='profile-avatar'
            defaultValue={avatar}
            onChange={() => {
              if (errors.root) {
                clearErrors(['root'])
              }
            }}
          />
          {errors.root && <p className='error'>{errors.root.message}. Please try again!</p>}
          <input type='submit' value={isLoading ? 'Loading...' : 'Update settings'} />
        </form>
        {userData && (
          <button
            type='button'
            className='logout-button'
            onClick={() => {
              setCookie('token', loggedInToken, -1)
              setToken(null)
              setUserData(null)
              navigate('/')
            }}
          >
            Or click here to Logout
          </button>
        )}
      </div>
    </div>
  )
}

Settings.propTypes = {
  setPleaseLoginMessage: PropTypes.func.isRequired,
  loggedInToken: PropTypes.string.isRequired,
  setToken: PropTypes.func.isRequired,
  setUserData: PropTypes.func.isRequired,
  userData: PropTypes.shape({
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    bio: PropTypes.string,
    image: PropTypes.string, // у тебя в форме используется userData.avatar, если это так, замени на avatar
    avatar: PropTypes.string, // если ты реально используешь avatar
  }).isRequired,
}
