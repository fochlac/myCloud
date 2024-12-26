/* self Response, Blob, self, caches, Request, Headers, console, fetch, navigator, setInterval, clearInterval, clearTimeout, setTimeout, indexedDB, __SWVERSION__ */
'use strict'
const serverUrl = location.origin
let version = __SWVERSION__

let assets = self.serviceWorkerOption.assets.map(asset => serverUrl + '/static' + asset)
let staticContent = [...assets, '/manifest.json']
let staticRegex = staticContent.length
  ? new RegExp(
      staticContent.map(str => str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')).join('$|') + '$',
    )
  : undefined

function handleFetch(event) {
  if (
    event.request.url.includes('localhost') ||
    // Ensure that chrome-extension:// requests don't trigger the default route.
    event.request.url.indexOf('http') !== 0 ||
    event.request.method.toLowerCase() !== 'get'
  ) {
    return
  }
  const req = event.request

  if (staticRegex && staticRegex.test(req.url)) {
    event.respondWith(
      caches
        .open(version)
        .then(cache => {
          return cache.match(req.clone())
        })
        .then(res => {
          if (res) {
            return res
          } else {
            cacheStatic()
            return fetch(req).catch(err => console.warn(err))
          }
        })
        .catch(err => console.warn(err)),
    )
  } else if (
    req.url.includes('/static/') ||
    req.url.includes('/api/images/') ||
    req.url.includes('fonts.')
  ) {
    event.respondWith(
      caches
        .open(version)
        .then(cache => cache.match(req))
        .then(res => {
          if (res) {
            return res
          } else {
            return Promise.all([fetch(req.clone()), caches.open(version)]).then(([res, cache]) => {
              cache.put(req.clone(), res.clone())
              return res
            })
          }
        })
        .catch(err => console.warn(err)),
    )
  } else {
    event.respondWith(
      fetch(req.clone())
        .then(res => {
          return caches
            .open(version)
            .then(cache => cache.put(req.clone(), res.clone()))
            .then(() => res)
        })
        .catch(err => {
          console.warn(err)
          return caches.open(version).then(cache => cache.match(req))
        }),
    )
  }
}

function cacheStatic() {
  return caches
    .keys()
    .then(keys => Promise.all(keys.map(key => caches.delete(key))))
    .catch(err => console.log('error deleting cache', err))
    .then(() => caches.open(version))
    .then(function(cache) {
      return cache.addAll(staticContent)
    })
    .catch(err => console.warn(err))
}

self.addEventListener('fetch', handleFetch)
self.addEventListener('install', event => {
  event.waitUntil(cacheStatic())
  self.skipWaiting()
})
