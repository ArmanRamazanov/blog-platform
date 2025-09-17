import { Outlet } from 'react-router-dom'
import Header from '../Header'
import PropTypes from 'prop-types'

export default function RootLayout({ userData }) {
  return (
    <div className='root-layout'>
      <Header userData={userData} />
      <main className='main'>
        <Outlet />
      </main>
    </div>
  )
}

RootLayout.propTypes = {
  userData: PropTypes.shape({
    username: PropTypes.string.isRequired,
    image: PropTypes.string,
  }),
}
