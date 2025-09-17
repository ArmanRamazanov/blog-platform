import { useState } from 'react'
import { useForm } from 'react-hook-form'
import CreateTags from './CreateTags'
import { useNavigate } from 'react-router-dom'
import '../../assets/styles/NewPost.css'
import PropTypes from 'prop-types'

export default function PostArticle({ userLoggedInToken, setPleaseLoginMessage }) {
  const [tags, setTags] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm()

  function deleteTag(id) {
    setTags(tags.filter((tag) => tag.id !== id))
  }

  console.log([...tags])
  async function onSubmit(data, e) {
    e.preventDefault()

    setIsLoading(true)
    let response
    try {
      response = await fetch('https://realworld.habsida.net/api/articles', {
        method: 'POST',
        headers: {
          Authorization: userLoggedInToken,
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          article: {
            title: data.postTitle,
            description: data.postDescription,
            body: data.postText,
            tagList: [...tags.map((tag) => tag.name)],
          },
        }),
      })
      if (!response.ok) throw { status: response.status, response }
      return navigate('/', { state: 'Successfully created!' })
    } catch (error) {
      const result = await error.response.json()

      if (error.status === 401) {
        setPleaseLoginMessage(<div className='login-message'>Please login first!</div>)
        setTimeout(() => {
          setPleaseLoginMessage(null)
        }, 1000)
        return navigate('/login')
      } else if (error.status === 422) {
        if (result.errors.body[0].includes('UNIQUE constraint failed')) {
          return setError('postTitle', {
            type: 'server',
            message: 'This title was already chosen',
          })
        }
      }
      return setError('root', {
        type: 'server',
        message: 'Something went wrong',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='new-post'>
      <div className='new-post__inner'>
        <h1>New Article</h1>
        <form
          onSubmit={handleSubmit((data, e) => {
            console.log(data)
            onSubmit(data, e)
          })}
        >
          {/*title */}
          {errors.postTitle && <p className='error'>{errors.postTitle.message}</p>}
          <input
            type='text'
            {...register('postTitle', { required: 'Please enter the title' })}
            name='postTitle'
            aria-label='post title'
            placeholder='Title'
            onChange={() => {
              if (errors.postTitle?.type === 'server') {
                clearErrors(['postTitle', 'root'])
              }
            }}
          />

          {/*description */}
          {errors.postDescription && <p className='error'>{errors.postDescription.message}</p>}
          <input
            type='text'
            {...register('postDescription', {
              required: 'Please provide a short description',
            })}
            name='postDescription'
            aria-label='post description'
            placeholder='Short description'
            onChange={() => {
              if (errors.root) {
                clearErrors(['root'])
              }
            }}
          />

          {/*content */}
          {errors.postText && <p className='error'>{errors.postText.message}</p>}
          <textarea
            name='postText'
            {...register('postText', { required: 'Please enter text' })}
            aria-label='post text'
            rows={10}
            placeholder='Input your text'
            onChange={() => {
              if (errors.root) {
                clearErrors(['root'])
              }
            }}
          ></textarea>

          {errors.root && <p className='error'>{errors.root.message}. Please try again!</p>}
          <CreateTags tags={tags} setTags={setTags} />
          {tags.length > 0 && (
            <div>
              Tags:
              <ul className='new-post__tags'>
                {tags.map((tag) => (
                  <li key={tag.id} className='new-post__tag'>
                    <p>{tag.name ? tag.name : 'default'}</p>
                    <button type='button' onClick={() => deleteTag(tag.id)}>
                      x
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <input type='submit' value={isLoading ? 'Loading...' : 'Publish'} />
        </form>
      </div>
    </div>
  )
}

PostArticle.propTypes = {
  userLoggedInToken: PropTypes.string.isRequired,
  setPleaseLoginMessage: PropTypes.func.isRequired,
}
