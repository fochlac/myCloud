import runtime from 'SW/runtime'

export const initServiceWorker = () => {
  if (
    'serviceWorker' in navigator &&
    (window.location.protocol === 'https:' || window.location.hostname === 'localhost')
  ) {
    runtime.register()
  }
}
