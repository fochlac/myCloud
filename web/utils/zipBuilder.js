export default class ZipBuilder {
  constructor(props) {
    this.props = {
      onAbort: () => null,
      onChange: () => null,
      onInit: () => null,
      onSuccess: () => null,
      onError: () => null,
      ...props,
    }

    if (!window.JSZip) {
      const script = document.createElement('script')
      script.src = '/static/jszip.min.js'
      script.type = 'text/javascript'
      script.onload = this.init.bind(this)
      document.querySelector('head').appendChild(script)
      this.ready = false
      this.readyPromise = new Promise(resolve => {
        this.initialized = resolve
      })
    } else {
      this.ready = true
      this.busy = false
      setTimeout(this.props.onInit, 0)
    }
  }

  init() {
    this.ready = true
    this.busy = false
    this.initialized()
    this.props.onInit()
  }

  abortZip() {
    this.abort = true
    this.props.onAbort()
  }

  zipGallery(gallery, imageSettings) {
    if (!this.ready) return Promise.reject('not yet ready')
    if (this.busy) return Promise.reject('already busy')
    this.abort = false
    const { onChange } = this.props
    const imageCount = gallery.get('images').size
    this.busy = true
    const zip = new window.JSZip()

    onChange({
      position: 0,
      imageCount,
    })

    this.queue = gallery
      .get('images')
      .reduce(
        (promise, image, index) =>
          promise.then(async () => {
            if (this.abort) return Promise.reject('user abort')
            const file = await loadImage(image, imageSettings)
            zip.file(image.get('name'), file)
            onChange({
              position: index + 1,
              imageCount,
            })
          }),
        Promise.resolve(),
      )
      .then(() => zip.generateAsync({ type: 'blob' }))
      .then(
        blob => {
          const objectUrl = URL.createObjectURL(blob)
          this.props.onSuccess(
            saveAs(objectUrl, `${gallery.get('name').replace(/[^a-zA-Z0-9-_]+/g, '_')}.zip`),
            objectUrl,
          )
        },
        err => this.props.onError('error creating zip file', err),
      )
      .then(() => {
        this.busy = false
      })
  }
}

function loadImage(image, { size }) {
  return fetch(`/api/images/${image.get('id')}?width=${size}&height=${size}`).then(res =>
    res.blob(),
  )
}

function saveAs(objectUrl, name) {
  const link = document.createElement('a')
  link.download = name
  link.href = objectUrl
  return () => link.click()
}
