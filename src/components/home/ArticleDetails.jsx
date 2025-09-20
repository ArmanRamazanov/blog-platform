import { useLoaderData, useNavigate, Link, useParams } from 'react-router-dom'
import '../../assets/styles/ArticleDetails.css'
import ReactMarkdown from 'react-markdown'
import favoriteArticle from '../../assets/helperFunctions/favoriteArticle'
import { useState } from 'react'
import PropTypes from 'prop-types'

import authorImageDefault from '../../assets/icons/profile.svg'

export default function ArticleDetails({
  userLoggedInToken,
  setPleaseLoginMessage,
  userData,
  setSuccessMessage,
}) {
  const article = useLoaderData()

  const navigate = useNavigate()
  const { slug } = useParams()
  const [likedResult, setLikedResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingFollow, setIsLoadingFollow] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [error, setError] = useState('')
  const [followError, setFollowError] = useState('')

  async function deleteArticle() {
    setIsLoading(true)
    let response
    try {
      response = await fetch(`https://realworld.habsida.net/api/articles/${slug}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${userLoggedInToken}`,
        },
      })
      if (!response.ok) throw { status: response.status }
      setSuccessMessage('Successfully deleted!')
      setTimeout(() => {
        setSuccessMessage('')
      }, 1000)
      return navigate('/')
    } catch {
      setError('Something went wrong. Please try again!')
      setTimeout(() => {
        setError('')
      }, 1000)
      return
    } finally {
      setIsLoading(false)
    }
  }

  async function followUser() {
    setIsLoadingFollow(true)
    let response
    try {
      response = await fetch(
        `https://realworld.habsida.net/api/profiles/${article.article.author.username}/follow`,
        {
          method: 'PUT',
          headers: {
            Authorization: userLoggedInToken,
          },
        },
      )
      const result = await response.json()
      if (!response.ok) throw { status: response.status, result: result }
    } catch (error) {
      if (error.status === 401) {
        setPleaseLoginMessage(<div className='login-message'>Please login first!</div>)
        setTimeout(() => {
          setPleaseLoginMessage(null)
        }, 1000)
        return navigate('/login')
      }
      setFollowError('Something went wrong. Please try again!')
      setTimeout(() => {
        setFollowError('')
      }, 1000)
      return
    } finally {
      setIsLoadingFollow(false)
    }
  }

  return (
    <>
      {openModal && (
        <div id='modal-background'>
          <div id='delete-modal'>
            <div className='modal-content'>
              <p>Are you sure you want delete the article?</p>
              {error && <p className='error'>{error}</p>}
              <div className='modal-interaction'>
                <button type='button' onClick={() => setOpenModal(false)}>
                  Cancel
                </button>
                <button type='button' onClick={deleteArticle}>
                  {isLoading ? 'Loading...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <main>
        <div className='article-details__banner'>
          <div className='article-details__info'>
            <h1>{article.article.title}</h1>
            <div>
              <img
                src={
                  !article.article.author.image ? authorImageDefault : article.article.author.image
                }
                alt='profile-picture'
                width='30px'
                height='30px'
                className='article-details__author-image'
                onError={(ev) => (ev.target.src = authorImageDefault)}
              ></img>
              <div>
                <div className='article-details__author'>
                  <p className='article-details__creator-name'>{article.article.author.username}</p>
                  {!(userData?.username === article.article.author.username) && (
                    <button
                      className='article-details__creator-follow'
                      type='button'
                      onClick={followUser}
                    >
                      {isLoadingFollow ? 'Loading...' : 'Follow'}
                    </button>
                  )}
                  {followError && <p className='error'>{followError}</p>}
                </div>
                <p className='article-details__created-date'>
                  {article.article.createdAt.substring(0, 10)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <section className='article-details__section'>
          <ReactMarkdown>{article.article.body}</ReactMarkdown>
          <ul className='article-details__tags'>
            {article.article.tagList.map((tag) => (
              <li key={tag} className='article-details__tag'>
                {tag}
              </li>
            ))}
          </ul>
          {likedResult && likedResult}
          <footer className='article-details__footer'>
            <div>
              <img
                src={
                  !article.article.author.image
                    ? '../../../assets/icons/profile.svg'
                    : article.article.author.image
                }
                alt='profile-picture'
                width='30px'
                height='30px'
                className='article-details__author-image'
              ></img>
              <div>
                <p className='article-details__creator-name'>{article.article.author.username}</p>
                <p className='article-details__created-date'>
                  {article.article.createdAt.substring(0, 10)}
                </p>
              </div>
            </div>
            {!(userData?.username === article.article.author.username) ? (
              <button
                type='button'
                className='article-details__favorite'
                onClick={async () => {
                  const response = await favoriteArticle(
                    article.article.slug,
                    userLoggedInToken,
                    setPleaseLoginMessage,
                  )
                  if (response.status === 401) {
                    setPleaseLoginMessage('Please login first')
                    setTimeout(() => {
                      setPleaseLoginMessage(null)
                    }, 1000)
                    return navigate('/login')
                  }
                  if (response.status === 200) {
                    setLikedResult(<div className='liked-article'>You liked the article!</div>)
                    setTimeout(() => {
                      setLikedResult(null)
                    }, 1000)
                    return
                  }
                }}
              >
                Favorite article
              </button>
            ) : (
              <div className='article-details__update'>
                <Link className='article-details__edit' to='edit'>
                  Edit
                </Link>
                <button
                  type='button'
                  className='article-details__delete'
                  onClick={() => setOpenModal(true)}
                >
                  Delete
                </button>
              </div>
            )}
          </footer>
        </section>
      </main>
    </>
  )
}

ArticleDetails.propTypes = {
  userLoggedInToken: PropTypes.string,
  setPleaseLoginMessage: PropTypes.func.isRequired,
  userData: PropTypes.shape({
    username: PropTypes.string,
  }),
  setSuccessMessage: PropTypes.func.isRequired,
}

export async function articleDetailsLoader({ params }) {
  const { slug } = params
  const response = await fetch(`https://realworld.habsida.net/api/articles/${slug}`)

  return response.json()
}
