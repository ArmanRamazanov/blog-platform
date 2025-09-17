import Article from './Article'
import '../../assets/styles/ArticlesList.css'
import PropTypes from 'prop-types'

export default function ArticlesList({
  articles,
  loggedInToken,
  setPleaseLoginMessage,
  pleaseLoginMessage,
}) {
  return (
    <ul className='articles-list'>
      {articles &&
        articles.articles.map((article) => (
          <li key={article.slug} className='articles-list-item'>
            <Article
              pleaseLoginMessage={pleaseLoginMessage}
              setPleaseLoginMessage={setPleaseLoginMessage}
              loggedInToken={loggedInToken}
              article={article}
            />
          </li>
        ))}
    </ul>
  )
}

ArticlesList.propTypes = {
  articles: PropTypes.shape({
    articles: PropTypes.arrayOf(
      PropTypes.shape({
        slug: PropTypes.string.isRequired,
        title: PropTypes.string,
        description: PropTypes.string,
        body: PropTypes.string,
        tagList: PropTypes.arrayOf(PropTypes.string),
        createdAt: PropTypes.string,
        updatedAt: PropTypes.string,
        author: PropTypes.shape({
          username: PropTypes.string,
          image: PropTypes.string,
        }),
      }),
    ),
    articlesCount: PropTypes.number,
  }),
  loggedInToken: PropTypes.string,
  setPleaseLoginMessage: PropTypes.func.isRequired,
  pleaseLoginMessage: PropTypes.node,
}
