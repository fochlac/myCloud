export const SET_BUSY = 'SET_BUSY'
export function setBusy(busy) {
  return {
    type: SET_BUSY,
    busy,
  }
}
export const SET_HD = 'SET_HD'
export function setHd(hd) {
  return {
    type: SET_HD,
    hd,
  }
}
export const SET_FULLSCREEN = 'SET_FULLSCREEN'
export function setFullscreen(fullscreen) {
  return {
    type: SET_FULLSCREEN,
    fullscreen,
  }
}
