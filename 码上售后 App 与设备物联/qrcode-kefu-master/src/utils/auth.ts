import Cookies from 'js-cookie'

const TOKEN_KEY = 'token'

const isLogin = () => {
  return !!Cookies.get(TOKEN_KEY)
}

const getToken = () => {
  return Cookies.get(TOKEN_KEY)
}

const setToken = (token: string) => {
  Cookies.set(TOKEN_KEY, token, { expires: 7 })
}

const clearToken = () => {
  Cookies.remove(TOKEN_KEY)
}

export { isLogin, getToken, setToken, clearToken }
