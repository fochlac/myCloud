import { fromJS } from 'immutable'

export const INITIALIZED = 'INITIALIZED'
export const COMPLETE = 'COMPLETE'
export const FAILURE = 'FAILURE'

export const apiMiddleware = store => next => action => {
  if (action.api && action.status === INITIALIZED) {
    const originalAction = Object.assign({}, action)
    const o = action.api

    next(originalAction)
    let headers = {}
    switch (o.headers) {
      case 'formdata':
        headers = {
          Accept: 'application/json',
        }
        break
      default:
        headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
    }

    let opt = {
      credentials: 'same-origin',
      method: o.method,
      headers,
    }

    if (o.body) {
      switch (o.headers) {
        case 'formdata':
          opt.body = o.body
          break
        case 'json':
        default:
          opt.body = JSON.stringify(o.body)
      }
    }

    return fetch(`/api/${o.url}`, opt)
      .then(res => {
        action.timeDiff = Date.now() - +res.headers.get('timestamp')
        if (res.status >= 400) {
          return res.json().then(data => Promise.reject(data))
        }
        return res.json()
      })
      .then(data => {
        action.status = COMPLETE
        action.data = fromJS(data)
        store.dispatch(action)
        if (action.enqueue) {
          store.dispatch(action.enqueue(data))
        }
      })
      .catch(err => {
        console.log(err)
        action.api = undefined
        action.data = err
        action.status = FAILURE
        store.dispatch(action)
      })
  } else {
    return next(action)
  }
}
