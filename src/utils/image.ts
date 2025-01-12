import * as sharp from 'sharp'

import { createReadStream, writeFile, createWriteStream } from 'fs-extra'

import { Stream } from 'stream'
import error from './error'
import { createGzip } from 'zlib';

const { internalError } = error('image-util')

sharp.cache(false)

function getResizer(width, height) {
  return sharp()
    .resize({
      width: !isNaN(width) ? width : 1280,
      height: !isNaN(height) ? height : 980,
      fit: sharp.fit.inside,
      withoutEnlargement: true
    })
    .withMetadata()
}

export function getResizedImageStream({
  image,
  dimensions: { width, height },
  raw = false
}: getImageType): Stream {
  function getResizedImage(compress?: boolean) {
    const stream = createReadStream(global.storage + image.path)
    const gzip = createGzip()

    stream.on('error', internalError(3, 'error reading image: '))
    gzip.on('error', internalError(3, 'error compressing image: '))

    if (raw) {
      return stream.pipe(gzip);
    }

    const resizer = getResizer(width, height)
    if (compress) {
      resizer.jpeg({ quality: 70 })
    }

    return stream.pipe(resizer).pipe(gzip);
  }

  if (width === 100 && height === 100) {
    const stream =  createReadStream(global.storage + image.path + '.100')
    stream.on('error', (err) => {
      if (err.code === 'ENOENT') {
          getResizedImage().pipe(stream, { end: true });
          getResizedImage(true).pipe(createWriteStream(global.storage + image.path + '.100'))
      } else {
          stream.emit('error', err);
      }
    })
  }

  return getResizedImage()
}

export function rotateImage(image: Core.Image, right: boolean = true) {
  return rotateDegrees(image, right ? 90 : -90)
}

export async function rotateDegrees(image: Core.Image, degrees: number) {
  const file = await sharp(global.storage + image.path)

  const rotatedImage = await file.rotate(degrees)

  await writeFile(global.storage + image.path, await rotatedImage.withMetadata().toBuffer())
  return image
}

interface getImageType {
  image: Core.Image
  dimensions: Core.Dimensions
  raw: boolean
  format?: 'webp'
}
