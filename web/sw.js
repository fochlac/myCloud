/* global Response, Blob, self, caches, Request, Headers, console, fetch, navigator, setInterval, clearInterval, clearTimeout, setTimeout, indexedDB */

'use strict'
const serverUrl = location.origin
let version = '33'
let assets = global.serviceWorkerOption.assets.map(asset => serverUrl + '/static' + asset)
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
    event.request.url.indexOf('http') !== 0
  ) {
    return
  }

  if (staticRegex && staticRegex.test(event.request.url)) {
    event.respondWith(
      caches
        .open(version)
        .then(cache => {
          return cache.match(event.request.clone())
        })
        .then(res => {
          if (res) {
            return res
          } else {
            cacheStatic()
            return fetch(event.request).catch(err => console.warn(err))
          }
        })
        .catch(err => console.warn(err)),
    )
  } else if (event.request.url.includes('/static/') || event.request.url.includes('/api/images/')) {
    event.respondWith(
      caches
        .open(version)
        .then(cache => cache.match(event.request))
        .then(res => {
          if (res) {
            return res
          } else {
            let req = event.request

            return Promise.all([fetch(req.clone()), caches.open(version)]).then(results => {
              let [res, cache] = results

              cache.put(req.clone(), res.clone())
              return res
            })
          }
        })
        .catch(err => console.warn(err)),
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
