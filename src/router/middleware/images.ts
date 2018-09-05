import * as multer from 'multer'

import galleryDb from 'modules/db/gallery'
import imageDb from 'modules/db/image'

const imageStore = multer({
  storage: multer.diskStorage({
    destination: destinationFinder,
    filename: fileName,
  }),
})

function destinationFinder(req, file, cb) {
  const { path } = galleryDb.get(req.params.id)
  cb(null, global.storage + path)
}

function fileName({ params: { imageId, id } }: any, { originalname }: any, cb) {
  if (!imageId) return cb(null, originalname)

  const filename = imageDb.get(imageId).path.split(galleryDb.get(id).path)[1]
  cb(null, filename)
}

export default imageStore
