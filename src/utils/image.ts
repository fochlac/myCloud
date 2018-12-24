import * as sharp from 'sharp'

import { createReadStream, writeFile } from 'fs-extra'

import { Stream } from 'stream';

sharp.cache(false)

const resizers = {}

function getResizer(width, height) {
  return sharp()
    .rotate()
    .resize(!isNaN(width) ? width : 1280, !isNaN(height) ? height : 980)
    .max()
}

export function getResizedImageStream({
  image,
  dimensions: { width, height },
  raw = false,
  format,
}: getImageType):Stream {
  const stream = createReadStream(global.storage + image.path)

  return raw
    ? stream
    : stream.pipe(getResizer(width, height))
}

export async function rotateImage(image: Core.Image, right: boolean = true) {
  const file = await sharp(global.storage + image.path)

  const rotatedImage = await file.rotate(right ? 90 : -90)

  await writeFile(global.storage + image.path, await rotatedImage.toBuffer())
  return image
}

interface getImageType {
  image: Core.Image
  dimensions: Core.Dimensions
  raw: boolean
  format?: 'webp'
}
