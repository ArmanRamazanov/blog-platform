import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom'
import { useState, useEffect, Suspense } from 'react'
import { lazy } from 'react'
//layouts
const RootLayout = lazy(() => import('./components/layouts/RootLayout'))
import HomeLayout from './components/layouts/HomeLayout'

//components
import ArticleDetails from './components/home/ArticleDetails'
const Signup = lazy(() => import('./components/signup/Signup'))
const Login = lazy(() => import('./components/login/Login'))
import Settings from './components/settings/Settings'
import PostArticle from './components/articleActions/PostArticle'
import NotFound from './components/NotFound'
import UpdateArticle from './components/articleActions/UpdateArticle'
import Error from './components/Error'

//helper functions
import { articleDetailsLoader } from './components/home/ArticleDetails'
import fetchLoggedInUser from './assets/helperFunctions/fetchLoggedInUser'
import getCookie from './assets/helperFunctions/getCookie'

import { TailChase } from 'ldrs/react'
import 'ldrs/react/TailChase.css'

function App() {
  //current-page for pagination
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 5

  //posts to skip for pagination
  const querySkip = currentPage * postsPerPage - postsPerPage

  //current user logged in token
  const [loggedInToken, setLoggedInToken] = useState(null)

  //current logged in user data
  const [userData, setUserData] = useState(null)

  //Please login message
  const [pleaseLoginMessage, setPleaseLoginMessage] = useState(null)

  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (getCookie('token')) {
      const value = getCookie('token')
      setLoggedInToken(value)
    }
    if (loggedInToken) {
      fetchLoggedInUser(loggedInToken, setUserData, setPleaseLoginMessage)
    }
  }, [loggedInToken])

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RootLayout userData={userData} />}>
        <Route
          index
          element={
            <HomeLayout
              setPleaseLoginMessage={setPleaseLoginMessage}
              pleaseLoginMessage={pleaseLoginMessage}
              userLoggedInToken={loggedInToken}
              currentPage={currentPage}
              postsPerPage={postsPerPage}
              setCurrentPage={setCurrentPage}
              querySkip={querySkip}
              successMessage={successMessage}
            />
          }
        ></Route>

        <Route
          path='articles'
          element={
            <HomeLayout
              setPleaseLoginMessage={setPleaseLoginMessage}
              pleaseLoginMessage={pleaseLoginMessage}
              userLoggedInToken={loggedInToken}
              currentPage={currentPage}
              postsPerPage={postsPerPage}
              setCurrentPage={setCurrentPage}
              querySkip={querySkip}
              successMessage={successMessage}
            />
          }
        ></Route>

        <Route
          path='new-article'
          element={
            <PostArticle
              userLoggedInToken={loggedInToken}
              setPleaseLoginMessage={setPleaseLoginMessage}
            />
          }
        ></Route>

        <Route
          path='sign-up'
          element={
            <Suspense
              fallback={
                <div className='fallback'>
                  <TailChase size={40} speed={1.75} color='#61BB61' />
                </div>
              }
            >
              <Signup />
            </Suspense>
          }
        ></Route>
        <Route
          path='sign-in'
          element={
            <Suspense
              fallback={
                <div className='fallback'>
                  <TailChase size={40} speed={1.75} color='#61BB61' />
                </div>
              }
            >
              <Login
                setToken={setLoggedInToken}
                pleaseLoginMessage={pleaseLoginMessage}
                setUserData={setUserData}
              />
            </Suspense>
          }
        />
        <Route
          path='settings'
          element={
            <Settings
              setUserData={setUserData}
              setPleaseLoginMessage={setPleaseLoginMessage}
              userData={userData}
              setToken={setLoggedInToken}
              loggedInToken={loggedInToken}
            />
          }
        />

        <Route
          path='articles/:slug'
          element={
            <ArticleDetails
              userLoggedInToken={loggedInToken}
              setPleaseLoginMessage={setPleaseLoginMessage}
              userData={userData}
              setSuccessMessage={setSuccessMessage}
              errorElement={<Error />}
            />
          }
          loader={articleDetailsLoader}
        ></Route>

        <Route
          path='articles/:slug/edit'
          element={<UpdateArticle userLoggedInToken={loggedInToken} />}
          loader={articleDetailsLoader}
        ></Route>
        <Route path='*' element={<NotFound />} />
      </Route>,
    ),
  )

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
