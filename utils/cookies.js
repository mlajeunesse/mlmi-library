/* Set cookie */
export function setCookie(cookie_name, cookie_value, seconds) {
  let cookieTime = new Date()
  cookieTime.setTime(cookieTime.getTime() + (seconds * 1000))
  document.cookie = cookie_name + "=" + cookie_value + ";" + "expires=" + cookieTime.toUTCString() + ";path=/"
}

/* Read cookie */
export function getCookie(cookie_name) {
  let name = cookie_name + "="
  let ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) == ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}
