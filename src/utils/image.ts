import * as sharp from 'sharp'

export default async function getImage(
  image: Core.Image,
  { width, height }: Core.Dimensions,
  format?: 'webp',
): Promise<File> {
  const resizedImage = await sharp(global.storage + image.path)
    .resize(!isNaN(width) ? width : 1280, !isNaN(height) ? height : 920)
    .max()
    .toBuffer()

  return resizedImage
}
