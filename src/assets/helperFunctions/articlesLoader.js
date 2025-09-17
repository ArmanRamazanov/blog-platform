export async function articlesLoader(querySkip) {
  let response
  try {
    response = await fetch(`https://realworld.habsida.net/api/articles?limit=5&offset=${querySkip}`)
    if (!response.ok) throw Error('Could not fetch the articles. Please try again later')
    return response.json()
  } catch (error) {
    alert(error)
  }
}
