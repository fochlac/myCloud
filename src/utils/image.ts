import * as sharp from 'sharp'

import { createReadStream, writeFile } from 'fs-extra'

import { Stream } from 'stream'
import error from './error'

const { internalError } = error('image-util')

sharp.cache(false)

const resizers = {}

function getResizer(width, height) {
  return sharp()
    .resize({
      width: !isNaN(width) ? width : 1280,
      height: !isNaN(height) ? height : 980,
      fit: sharp.fit.inside,
      withoutEnlargement: true
    })
}

export function getResizedImageStream({
  image,
  dimensions: { width, height },
  raw = false
}: getImageType): Stream {
  const stream = createReadStream(global.storage + image.path)

  stream.on('error', internalError(3, 'error reading image: '))
  return raw ? stream : stream.pipe(getResizer(width, height))
}

export function rotateImage(image: Core.Image, right: boolean = true) {
  return rotateDegrees(image, right ? 90 : -90)
}

export async function rotateDegrees(image: Core.Image, degrees: number) {
  const file = await sharp(global.storage + image.path)

  const rotatedImage = await file.rotate(degrees)

  await writeFile(global.storage + image.path, await rotatedImage.toBuffer())
  return image
}

interface getImageType {
  image: Core.Image
  dimensions: Core.Dimensions
  raw: boolean
  format?: 'webp'
}
