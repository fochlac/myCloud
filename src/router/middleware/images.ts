import * as multer from 'multer'

import galleryDb from '../../modules/db/gallery'
import imageDb from '../../modules/db/image'
import { ensureDir } from 'fs-extra'
import { createWriteStream, unlink } from 'fs'
import { basename, join } from 'path'

// https://github.com/expressjs/multer/blob/v1.3.1/storage/disk.js
class ImageStore {
  async _handleFile(req, file, cb) {
    try {
      const { path: galleryPath } = galleryDb.getBare(req.params.id)

      await ensureDir(global.storage + galleryPath)

      const { imageId } = req?.params ?? {}
      const image = imageId && imageDb.get(imageId)
      const imagePath = join(global.storage, image ? image.path : join(galleryPath, file.originalname))
      const outStream = createWriteStream(imagePath)

      file.stream.pipe(outStream)
      outStream.on('error', cb)
      outStream.on('finish', function () {
        cb(null, {
          destination: galleryPath,
          filename: basename(imagePath),
          path: imagePath,
          size: outStream.bytesWritten
        })
      })
    }
    catch (error) {
      cb(error)
    }
  }

  _removeFile (_req, file, cb) {
    var path = file.path

    delete file.destination
    delete file.filename
    delete file.path

    unlink(path, cb)
  }
}

const imageStore = multer({ storage: new ImageStore() })


export default imageStore
