import '../../assets/styles/Pagination.css'
import PropTypes from 'prop-types'

export default function Pagination({ articles, setCurrentPage, postsPerPage, currentPage }) {
  const paginationButtons = []

  if (articles) {
    for (let i = 1; i <= Math.ceil(articles.articlesCount / postsPerPage); i++) {
      paginationButtons.push(i)
    }
  }

  return (
    <div className='pagination'>
      {paginationButtons.map((paginationButton, index) => (
        <button
          className={`pagination-button-${currentPage === paginationButton ? 'active' : ''} pagination-button`}
          onClick={() => setCurrentPage(paginationButton)}
          key={index}
        >
          {paginationButton}
        </button>
      ))}
    </div>
  )
}

Pagination.propTypes = {
  articles: PropTypes.shape({
    articlesCount: PropTypes.number.isRequired,
  }),
  setCurrentPage: PropTypes.func.isRequired,
  postsPerPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
}
