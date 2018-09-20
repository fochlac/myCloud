import * as sharp from 'sharp'

import { readFile, writeFile } from 'fs-extra'

sharp.cache(false)

export async function getImage({
  image,
  dimensions: { width, height },
  raw = false,
  format,
}: getImageType): Promise<File> {
  if (raw) {
    return readFile(global.storage + image.path)
  }

  const resizedImage = await sharp(global.storage + image.path)
    .rotate()
    .resize(!isNaN(width) ? width : 1280, !isNaN(height) ? height : 980)
    .max()
    .toBuffer()

  return resizedImage
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
