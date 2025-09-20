import favoriteArticle from '../../assets/helperFunctions/favoriteArticle'
import '../../assets/styles/Article.css'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useState } from 'react'

import authorImageDefault from '../../assets/icons/profile.svg'
import likeButton from '../../assets/icons/like.svg'

export default function Article({ article, loggedInToken, setPleaseLoginMessage }) {
  const [likedResult, setLikedResult] = useState(null)

  return (
    <div className='article'>
      <div className='article__inner'>
        <header className='article__header'>
          <div className='article__info'>
            <img
              src={article.author.image ? article.author.image : authorImageDefault}
              alt='profile picture'
              width='40px'
              height='40px'
              onError={(ev) => (ev.target.src = authorImageDefault)}
            ></img>
            <div>
              <p className='article__creator-name'>{article.author.username}</p>
              <p className='article__created-date'>{article.createdAt.substring(0, 10)}</p>
            </div>
          </div>
          <div>
            <button
              disabled={loggedInToken ? false : true}
              className='article__like-button'
              onClick={async () => {
                const response = await favoriteArticle(
                  article.slug,
                  loggedInToken,
                  setPleaseLoginMessage,
                )
                if (response.status === 200) {
                  setLikedResult(<p className='liked-article'>You liked the article!</p>)
                  setTimeout(() => {
                    setLikedResult(null)
                  }, 1000)
                  return
                }
              }}
            >
              <img src={likeButton} alt='like'></img>
              <p>{article.favoritesCount}</p>
            </button>
            {likedResult && likedResult}
          </div>
        </header>
        <section className='article__content'>
          <h3 className='article__title'>
            <Link to={`/articles/${article.slug.toString()}`}>{article.title}</Link>
          </h3>
          <p className='article__paragraph'>{article.description}</p>
        </section>
        <footer className='article__footer'>
          <div className='article__footer-inner'>
            <ul className='article__tags'>
              {article.tagList[0] !== null &&
                article.tagList.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          </div>
        </footer>
      </div>
    </div>
  )
}

Article.propTypes = {
  article: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    favoritesCount: PropTypes.number,
    tagList: PropTypes.arrayOf(PropTypes.string),
    createdAt: PropTypes.string.isRequired,
    author: PropTypes.shape({
      username: PropTypes.string.isRequired,
      image: PropTypes.string,
    }).isRequired,
  }).isRequired,
  loggedInToken: PropTypes.string,
  setPleaseLoginMessage: PropTypes.func.isRequired,
}
