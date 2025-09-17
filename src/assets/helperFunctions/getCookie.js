export default function getCookie(cname) {
  const name = cname + '='
  const splitCookiePairs = decodeURIComponent(document.cookie).split(';')
  for (let index = 0; index < splitCookiePairs.length; index++) {
    let pair = splitCookiePairs[index]
    while (pair.charAt(0) == ' ') {
      pair = pair.substring(1)
    }
    if (pair.indexOf(name) == 0) {
      return pair.substring(name.length, pair.length)
    }
  }
  return ''
}
