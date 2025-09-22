export async function tagsLoader() {
  let response
  try {
    response = await fetch('https://realworld.habsida.net/api/tags')
    if (!response.ok) throw new Error()
    return response.json()
  } catch {
    return 'Something went wrong'
  }
}
