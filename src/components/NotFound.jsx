import { Link } from 'react-router-dom'

import errorIcon from '../assets/icons/error.png'

function NotFound() {
  return (
    <div className='not-found'>
      <img src={errorIcon} alt='not found flag icon' width={100} height={100} />
      <div className='not-found__content'>
        <h2>404</h2>
        <p>Ooops... You may have searched the wrong path</p>
        <Link to='/'>Go home</Link>
      </div>
    </div>
  )
}

export default NotFound
