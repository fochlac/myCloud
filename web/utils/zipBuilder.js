const MAX_IMAGES_PER_ZIP = 500
const USER_ABORT = 'user abort'

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

  zipGallery(gallery, imageSettings, options = {}) {
    if (!this.ready) return Promise.reject('not yet ready')
    if (this.busy) return Promise.reject('already busy')
    this.abort = false
    const { onChange } = this.props
    const startIndex = options.startIndex || 0
    const totalImageCount = gallery.get('images').size
    const images = gallery.get('images').slice(startIndex, startIndex + MAX_IMAGES_PER_ZIP)
    const imageCount = images.size
    const chunkCount = Math.max(Math.ceil(totalImageCount / MAX_IMAGES_PER_ZIP), 1)
    const chunkIndex = Math.floor(startIndex / MAX_IMAGES_PER_ZIP) + 1
    const endIndex = startIndex + imageCount
    const hasMore = endIndex < totalImageCount
    const fileName = buildZipName(gallery.get('name'), chunkIndex, chunkCount)
    this.busy = true
    const zip = new window.JSZip()

    onChange({
      position: 0,
      imageCount,
      totalImageCount,
      chunkIndex,
      chunkCount,
      startIndex,
      endIndex,
    })

    this.queue = images
      .reduce(
        (promise, image, index) =>
          promise.then(async () => {
            if (this.abort) return Promise.reject(USER_ABORT)
            const file = await loadImage(image, imageSettings)
            zip.file(image.get('name'), file)
            onChange({
              position: index + 1,
              imageCount,
              totalImageCount,
              chunkIndex,
              chunkCount,
              startIndex,
              endIndex,
            })
          }),
        Promise.resolve(),
      )
      .then(() => {
        if (this.abort) return Promise.reject(USER_ABORT)
        return zip.generateAsync({ type: 'blob' })
      })
      .then(blob => {
        const objectUrl = URL.createObjectURL(blob)

        releaseZip(zip)

        this.props.onSuccess(
          saveAs(objectUrl, fileName),
          objectUrl,
          {
            fileName,
            chunkIndex,
            chunkCount,
            startIndex,
            endIndex,
            imageCount,
            totalImageCount,
            hasMore,
            nextStartIndex: endIndex,
          },
        )

        return null
      })
      .catch(err => {
        if (err !== USER_ABORT) {
          this.props.onError('error creating zip file', err)
        }
      })
      .then(() => {
        this.busy = false
        this.queue = null
      })

    return this.queue
  }
}

function buildZipName(galleryName, chunkIndex, chunkCount) {
  const sanitizedGalleryName = galleryName.replace(/[^a-zA-Z0-9-_]+/g, '_')

  if (chunkCount === 1) {
    return `${sanitizedGalleryName}.zip`
  }

  return `${sanitizedGalleryName}_part-${String(chunkIndex).padStart(String(chunkCount).length, '0')}-of-${chunkCount}.zip`
}

function loadImage(image, { size }) {
  const query = size === 'raw' ? 'raw=raw' : `width=${size}&height=${size}`
  return fetch(`/api/images/${image.get('id')}?${query}`).then(res => res.blob())
}

function saveAs(objectUrl, name) {
  const link = document.createElement('a')

  link.download = name
  link.href = objectUrl

  return () => {
    document.body.appendChild(link)
    link.click()
    link.remove()
  }
}

function releaseZip(zip) {
  Object.keys(zip.files).forEach(name => zip.remove(name))
}
