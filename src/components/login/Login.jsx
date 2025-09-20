import { useForm } from 'react-hook-form'
import { useState } from 'react'
import '../../assets/styles/Login.css'
import { useNavigate, Link } from 'react-router-dom'
import setCookie from '../../assets/helperFunctions/setCookie'
import PropTypes from 'prop-types'

export default function Login({ setToken, pleaseLoginMessage, setUserData }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm()

  async function onSubmit(data) {
    setIsLoading(true)
    let response
    try {
      response = await fetch('https://realworld.habsida.net/api/users/login', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            email: data.email,
            password: data.password,
          },
        }),
      })
      const result = await response.json()
      if (!response.ok) throw { status: response.status, result }
      setToken(result.user.token)
      setCookie('token', result.user.token, 1)
      setUserData(result.user)
      return navigate('/')
    } catch (error) {
      console.log(error.result)
      if (error.result.errors.body) {
        return setError('invalidCredentials', {
          type: 'server',
          message: error.result.errors.body[0],
        })
      }
      return setError('root', { type: 'server', message: 'Something went wrong' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='login'>
      {pleaseLoginMessage && pleaseLoginMessage}
      <div className='login__inner'>
        <h1>Sign in</h1>
        <div className='create-account'>
          Don&apos;t you have an account?
          <Link to='/sign-up'>Create account</Link>
        </div>
        <form
          onSubmit={handleSubmit((data) => {
            onSubmit(data)
          })}
        >
          {/*email */}
          {errors.email && <p className='error'>{errors.email.message}</p>}
          <input
            type='text'
            id='login-email'
            {...register('email', { required: 'Please enter your email' })}
            placeholder='Email'
            aria-label='email'
            name='email'
            onChange={() => {
              clearErrors(['invalidCredentials', 'root'])
            }}
          />

          {/*password */}
          {errors.password && <p className='error'>{errors.password.message}</p>}
          <input
            type='text'
            id='login-password'
            {...register('password', { required: 'Please enter your password' })}
            placeholder='Password'
            aria-label='password'
            name='password'
            onChange={() => {
              clearErrors(['invalidCredentials', 'root'])
            }}
          />
          {errors.invalidCredentials && (
            <p className='error'>{errors.invalidCredentials.message}</p>
          )}
          {errors.root && <p className='error'>{errors.root.message}</p>}
          <input type='submit' value={isLoading ? 'Loading...' : 'Sign in'} />
        </form>
      </div>
    </div>
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
  pleaseLoginMessage: PropTypes.node,
  setUserData: PropTypes.func.isRequired,
}
