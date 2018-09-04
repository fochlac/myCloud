import multer from 'multer'
import galleryDb from 'SERVER/modules/gallery'

const galleryStores = {}

function generateStore(id) {
  const { path } = galleryDb.get(id)
  return multer({
    storage: multer.diskStorage({
      destination: global.storage + path
    })
  })
}


module.exports = (req, res, next) => {
  const {params: {id}} = req
  if (!galleryStores[id]) {
    galleryStores[id] = generateStore(id)
  }

  return galleryStores[id](req, res, next)
};


