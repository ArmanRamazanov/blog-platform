import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../../assets/styles/SignUp.css'

export default function Signup() {
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm()

  async function onSubmit(data) {
    setIsLoading(true)
    let response

    try {
      response = await fetch('https://realworld.habsida.net/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            username: data.username,
            email: data.email,
            password: data.password,
          },
        }),
      })
      if (!response.ok) throw { status: response.status, response }
      return navigate('/login')
    } catch (error) {
      const result = await error.response.json()

      if (result.errors.body) {
        const errorMessage = result.errors.body[0]
        if (errorMessage.toLowerCase().includes('users.username')) {
          return setError('username', { type: 'server', message: 'Username is already taken' })
        } else if (errorMessage.toLowerCase().includes('users.email')) {
          return setError('email', { type: 'server', message: 'Email is already taken' })
        }
      }

      return setError('root', { type: 'server', message: 'Something went wrong' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='sign-up'>
      <div className='sign-up__inner'>
        <h1>Sign Up</h1>
        <div className='login-account'>
          Already a member?
          <Link to='/login'>Login to account</Link>
        </div>
        <form
          onSubmit={handleSubmit((data) => {
            onSubmit(data)
          })}
        >
          {/*username*/}
          {errors.username && <p className='error'>{errors.username.message}</p>}
          <input
            type='text'
            id='signup-username'
            {...register('username', {
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Username must be between 3  and 20 characters',
              },
              maxLength: {
                value: 20,
                message: 'Username must be between 3 and 20 characters',
              },
            })}
            placeholder='Username'
            aria-label='username'
            name='username'
            onChange={() => {
              if (errors.username?.type === 'server' || errors.root) {
                clearErrors(['username', 'root'])
              }
            }}
          />

          {/*email */}
          {errors.email && <p className='error'>{errors.email.message}</p>}
          <input
            type='email'
            id='signup-email'
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^([a-zA-Z\d.]+)@([a-zA-Z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/,
                message: 'Please enter a valid email address',
              },
            })}
            placeholder='Email'
            aria-label='email'
            name='email'
            onChange={() => {
              if (errors.email?.type === 'server' || errors.root) {
                clearErrors(['email', 'root'])
              }
            }}
          />

          {/*password */}
          {errors.password && <p className='error'>{errors.password.message}</p>}
          <input
            type='password'
            id='signup-password'
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be between 6 and 40 characters',
              },
              maxLength: {
                value: 40,
                message: 'Password must be between 6 and 40 characters',
              },
            })}
            placeholder='Password'
            aria-label='password'
            name='password'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (errors.root) {
                clearErrors(['root'])
              }
            }}
          />

          {/*repeat password*/}
          {errors.repeatPassword && <p className='error'>{errors.repeatPassword.message}</p>}
          <input
            type='password'
            id='signup-repeat-password'
            {...register('repeatPassword', {
              validate: (value) => value === password || 'Passwords must match',
            })}
            placeholder='Repeat Password'
            aria-label='repeat password'
            name='repeatPassword'
            onChange={() => {
              if (errors.root) {
                clearErrors(['root'])
              }
            }}
          />

          {errors.root && <p className='error'>{errors.root.message}</p>}
          {/*checkbox */}
          {errors.checkbox && <p className='error checkbox-error'>{errors.checkbox.message}</p>}
          <label>
            <input
              type='checkbox'
              name='checkbox'
              {...register('checkbox', { required: 'Please read our terms and select the option' })}
            />
            I agree to process my personal information
          </label>
          <input type='submit' value={isLoading ? 'Loading...' : 'Sign Up'} />
        </form>
      </div>
    </div>
  )
}
