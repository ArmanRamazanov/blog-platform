import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import '../assets/styles/Header.css'
import PropTypes from 'prop-types'

import closeSidebarIcon from '../assets/icons/close_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg'
import newPostIcon from '../assets/icons/new-post.svg'
import settingsIcon from '../assets/icons/settings.svg'
import profileIcon from '../assets/icons/profile.svg'
import openSiderBarIcon from '../assets/icons/menu_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg'

export default function Header({ userData }) {
  const [sidebar, showSideBar] = useState(false)

  function handleSideBar() {
    showSideBar((prev) => !prev)
  }
  return (
    <header className='header'>
      <div className='header__inner'>
        <div className='header__logo'>
          <h1>Realworld Blog</h1>
        </div>
        <nav className='header__nav'>
          {sidebar && (
            <ul className='sidebar'>
              <li>
                <button onClick={handleSideBar}>
                  <img src={closeSidebarIcon} alt='close sidebar' />
                </button>
              </li>
              <li>
                <NavLink to='/'>Home</NavLink>
              </li>
              <li>
                <NavLink to='/new-article'>New Post</NavLink>
              </li>
              <li>
                <NavLink to={userData ? 'settings' : 'login'}>Settings</NavLink>
              </li>
              <li>
                <NavLink to={userData ? 'profile' : 'login'}>
                  {userData ? userData.username : 'profile'}
                </NavLink>
              </li>
            </ul>
          )}
          <ul className='menu-bar'>
            <li className='hideOnMobile'>
              <NavLink to='/'>Home</NavLink>
            </li>
            <li className='hideOnMobile'>
              <img src={newPostIcon} alt='new post'></img>
              <NavLink to='new-article'>New Post</NavLink>
            </li>
            <li className='hideOnMobile'>
              <img src={settingsIcon} alt='settings' />
              <NavLink to='/settings'>Settings</NavLink>
            </li>
            <li className='hideOnMobile'>
              {userData ? (
                <NavLink to='/profile'>
                  <img
                    src={userData ? (userData.image ? userData.image : profileIcon) : profileIcon}
                    onError={(ev) => (ev.target.src = profileIcon)}
                    alt='profile'
                    width='30'
                    height='30'
                  />
                  {userData ? userData.username : 'profile'}
                </NavLink>
              ) : (
                <NavLink to='/login'>
                  <img
                    src={userData ? (userData.image ? userData.image : profileIcon) : profileIcon}
                    onError={(ev) => (ev.target.src = profileIcon)}
                    alt='profile'
                    width='30'
                    height='30'
                  />
                  Login
                </NavLink>
              )}
            </li>
            <li>
              <button onClick={handleSideBar}>
                <img src={openSiderBarIcon} alt='open sidebar' />
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

Header.propTypes = {
  userData: PropTypes.shape({
    username: PropTypes.string.isRequired,
    image: PropTypes.string,
  }),
}
