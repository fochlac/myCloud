export const LOGIN = 'LOGIN'
export function login({ name, password }) {
  return {
    type: LOGIN,
    api: {
      method: 'post',
      url: 'user/login',
      body: {
        name,
        password,
      },
    },
  }
}

export const REGISTER = 'REGISTER'
export function register({ name, password }) {
  return {
    type: REGISTER,
    api: {
      method: 'post',
      url: 'user/',
      body: {
        name,
        password,
      },
    },
  }
}
