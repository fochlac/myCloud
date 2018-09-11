export function resize(file, maxDimensions) {
  return new Promise((resolve, reject) => {
    const maxWidth = maxDimensions.width;
    const maxHeight = maxDimensions.height

    if (!file.type.match(/image.*/)) {
      return reject()
    }

    const image = document.createElement('img')

    image.onload = imgEvt => {
      let width = image.width
      let height = image.height
      let isTooLarge = false

      if (width >= height && width > maxWidth) {
        height *= maxWidth / width
        width = maxWidth
        isTooLarge = true
      } else if (height > maxHeight) {
        width *= maxHeight / height
        height = maxHeight
        isTooLarge = true
      }

      if (!isTooLarge) {
        return resolve(file)
      }

      let canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      let ctx = canvas.getContext('2d')
      ctx.drawImage(image, 0, 0, width, height)

      resolve(canvas)
    }

    image.src = URL.createObjectURL(file)
  })
}

export function createSmallObjectURL(image, size = 200) {
  return resize(image, { width: size, height: size }).then(canvas => canvas.toDataURL())
}
