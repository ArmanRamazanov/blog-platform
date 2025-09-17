import errorIcon from '../assets/icons/error.png'
import { Link } from 'react-router-dom'

function Error() {
  return (
    <div className='error-page'>
      <img src={errorIcon} alt='error flag icon' width={100} height={100} />
      <div className='error-page__content'>
        <h2>404</h2>
        <p>Ooops... Something went wrong</p>
        <Link to='/'>Go home</Link>
      </div>
    </div>
  )
}

export default Error
