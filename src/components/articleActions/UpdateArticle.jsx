import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useLoaderData, useParams } from 'react-router-dom'
import '../../assets/styles/NewPost.css'
import PropTypes from 'prop-types'

export default function UpdateArticle({ userLoggedInToken, setSuccessMessage }) {
  const article = useLoaderData()
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const [title, setTitle] = useState(article.article.title)
  const [description, setDescription] = useState(article.article.description)
  const [text, setText] = useState(article.article.body)
  const tags = article.article.tagList
  const { slug } = useParams()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm()

  async function onSubmit(data, e) {
    e.preventDefault()

    setIsLoading(true)
    let response
    try {
      response = await fetch(`https://realworld.habsida.net/api/articles/${slug}`, {
        method: 'PUT',
        headers: {
          Authorization: `Token ${userLoggedInToken}`,
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          article: {
            title: data.updateTitle,
            description: data.updateDescription,
            body: data.updateText,
          },
        }),
      })
      if (!response.ok) throw { status: response }
      setSuccessMessage('Successfully updated!')
      setTimeout(() => {
        setSuccessMessage('')
      }, 1000)
      return navigate('/')
    } catch {
      return setError('root', { type: 'server', message: 'Something went wrong' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='new-post'>
      <div className='new-post__inner'>
        <h1>Update Article</h1>

        <form
          onSubmit={handleSubmit((data, e) => {
            if (
              data.postTitle === article.article.title &&
              data.postDescription === article.article.description &&
              data.postText === article.article.body
            ) {
              return
            }

            onSubmit(data, e)
          })}
        >
          {/*title */}
          {errors.postTitle && <p className='error'>{errors.postTitle.message}</p>}
          <input
            type='text'
            {...register('updateTitle', { required: 'Please enter the title' })}
            name='updateTitle'
            aria-label='post title'
            placeholder='Title'
            value={title}
            onChange={(e) => {
              setTitle(e.currentTarget.value)
              if (errors.root) {
                clearErrors(['root'])
              }
            }}
          />

          {/*description */}
          {errors.postDescription && <p className='error'>{errors.postDescription.message}</p>}
          <input
            type='text'
            {...register('updateDescription', { required: 'Please provide a short description' })}
            name='updateDescription'
            aria-label='post description'
            placeholder='Short description'
            value={description}
            onChange={(e) => {
              setDescription(e.currentTarget.value)
              if (errors.root) {
                clearErrors(['root'])
              }
            }}
          />

          {/*content */}
          {errors.postText && <p className='error'>{errors.postText.message}</p>}
          <textarea
            name='updateText'
            {...register('updateText', { required: 'Please enter text' })}
            aria-label='post text'
            rows={10}
            placeholder='Input your text'
            value={text}
            onChange={(e) => {
              setText(e.currentTarget.value)
              if (errors.root) {
                clearErrors(['root'])
              }
            }}
          ></textarea>

          {errors.root && <p className='error'>{errors.root.message}. Please try again!</p>}
          {tags.length > 0 && (
            <div>
              Tags:
              <ul className='new-post__tags'>
                {tags.map((tag, index) => (
                  <li key={index} className='new-post__tag'>
                    <p>{tag ? tag : 'default'}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <input type='submit' value={isLoading ? 'Loading...' : 'Update'} />
        </form>
      </div>
    </div>
  )
}

UpdateArticle.propTypes = {
  userLoggedInToken: PropTypes.string.isRequired,
  setSuccessMessage: PropTypes.func.isRequired,
}
