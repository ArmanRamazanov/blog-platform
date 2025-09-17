export default async function favoriteArticle(slug, loggedInToken) {
  let response

  try {
    response = await fetch(`https://realworld.habsida.net/api/articles/${slug}/favorite`, {
      method: 'POST',
      headers: {
        Authorization: `${loggedInToken}`,
      },
    })
    const result = await response.json()
    if (!response.ok) throw { status: response.status, result }
    return { status: response.status }
  } catch (error) {
    return error
  }
}
