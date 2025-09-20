export default async function fetchLoggedInUser(loggedInToken, setUserData, setPleaseLoginMessage) {
  let response
  try {
    response = await fetch('https://realworld.habsida.net/api/user', {
      method: 'GET',
      headers: {
        Authorization: `Token ${loggedInToken}`,
      },
    })
    if (!response.ok) throw { status: response.status }
    const result = await response.json()
    setUserData(result.user)
  } catch (error) {
    if (error.status === 401) {
      setPleaseLoginMessage(<div className='login-message'>Please login!</div>)
      setTimeout(() => {
        setPleaseLoginMessage(null)
      }, 2000)
      return
    }
    return alert('Something went wrong. Please try again later')
  }
}
