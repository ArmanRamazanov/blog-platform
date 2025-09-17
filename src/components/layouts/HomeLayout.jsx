import Pagination from '../home/Pagination'
import '../../assets/styles/Home.css'
import { lazy, Suspense, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { articlesLoader } from '../../assets/helperFunctions/articlesLoader'
import { useLocation } from 'react-router-dom'

//tail-chase loader
import { TailChase } from 'ldrs/react'
import 'ldrs/react/TailChase.css'

//lazy importing components
const ArticlesList = lazy(() => import('../home/ArticlesList'))

export default function Home({
  setCurrentPage,
  postsPerPage,
  currentPage,
  pleaseLoginMessage,
  userLoggedInToken,
  setPleaseLoginMessage,
  querySkip,
}) {
  const location = useLocation()

  const [articles, setArticles] = useState(null)
  const [successMessage, setSuccessMessage] = useState(location.state ? location.state : null)

  setTimeout(() => {
    setSuccessMessage(null)
  }, 1000)

  useEffect(() => {
    const loader = async () => {
      try {
        const articles = await articlesLoader(querySkip)
        setArticles(articles)
      } catch (error) {
        console.log(error)
      }
    }

    loader()
  }, [currentPage])

  return (
    <>
      <div className='main__banner'>
        <h1 className='main__banner-title'>Realworld Blog</h1>
        <p className='main__banner-paragraph'>A place to share your knowledge</p>
      </div>
      <div className='main__search-tags'>
        <div className='main__search-tags-inner'>
          <p>Popular tags</p>
          <ul className='main__search-tags-list'>
            <li>
              <button>tag</button>
            </li>
            <li>
              <button>tag</button>
            </li>
            <li>
              <button>tag</button>
            </li>
            <li>
              <button>tag</button>
            </li>
            <li>
              <button>tag</button>
            </li>
          </ul>
        </div>
      </div>
      <section className='main__section'>
        <Suspense
          fallback={
            <TailChase size={40} speed={1.75} color='#61BB61' className='tail-chase-fallback' />
          }
        >
          {successMessage && <p className='success-message'>{successMessage}</p>}
          <ArticlesList
            pleaseLoginMessage={pleaseLoginMessage}
            setPleaseLoginMessage={setPleaseLoginMessage}
            loggedInToken={userLoggedInToken}
            articles={articles}
          />
        </Suspense>
      </section>
      <footer className='main__footer'>
        <Pagination
          currentPage={currentPage}
          postsPerPage={postsPerPage}
          setCurrentPage={setCurrentPage}
          articles={articles}
        />
      </footer>
    </>
  )
}

Home.propTypes = {
  setCurrentPage: PropTypes.func.isRequired,
  postsPerPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  pleaseLoginMessage: PropTypes.node, // может быть JSX или null
  userLoggedInToken: PropTypes.string,
  setPleaseLoginMessage: PropTypes.func.isRequired,
  querySkip: PropTypes.number,
}
