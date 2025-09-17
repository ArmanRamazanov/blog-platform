export default function setCookie(cname, cvalue, days) {
  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${cname}=${cvalue};expires=${date.toUTCString()};path=/`
}
