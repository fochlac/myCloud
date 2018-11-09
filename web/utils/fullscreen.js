const key = {
  requestFullscreen: 0,
  exitFullscreen: 1,
  fullscreenElement: 1,
}

const webkit = [
  'webkitRequestFullscreen',
  'webkitExitFullscreen',
  'webkitFullscreenElement',
  'webkitFullscreenEnabled',
]

const moz = [
  'mozRequestFullScreen',
  'mozCancelFullScreen',
  'mozFullScreenElement',
  'mozFullScreenEnabled',
]

const ms = ['msRequestFullscreen', 'msExitFullscreen', 'msFullscreenElement', 'msFullscreenEnabled']

const vendor =
  ('fullscreenEnabled' in document && Object.keys(key)) ||
  (webkit[3] in document && webkit) ||
  (moz[3] in document && moz) ||
  (ms[3] in document && ms) ||
  []

export const requestFullscreen = (element = document.body) => element[vendor[0]]()
export const exitFullscreen = function() {
  return document[vendor[1]].bind(document)()
}
