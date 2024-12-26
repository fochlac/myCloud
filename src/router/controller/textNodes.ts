import textNodeDb from '../../modules/db/textNode'
import galleryDb from '../../modules/db/gallery'
import logger from '../../utils/logger'

const log = (level, ...message) => logger(level, 'controller/textNodes.ts -', ...message)

export default {
  create: async ({ id, text, type, dateTime }) => {
    log(7, `creating text node in gallery ${id}`)
    const textNode = await textNodeDb.create({ text, type, galleryId: id, dateTime })
    await galleryDb.insertTextNode(id, textNode)
    log(7, `successfully created text node in gallery ${id}`)
    return textNode
  },

  update: async ({ nodeId, text, type, dateTime }) => {
    log(7, `updating text node ${nodeId}`)
    const textNode = textNodeDb.get(nodeId)
    if (!textNode) {
      log(4, `text node ${nodeId} not found`)
      throw new Error(`Text node ${nodeId} not found`)
    }
    const updatedTextNode = await textNodeDb.update({ id: nodeId, text, type, dateTime })
    log(7, `successfully updated text node ${nodeId}`)
    return updatedTextNode
  },

  delete: async ({ galleryId, nodeId }) => {
    log(7, `deleting text node ${nodeId} from gallery ${galleryId}`)
    const textNode = textNodeDb.get(nodeId)
    if (!textNode) {
      log(4, `text node ${nodeId} not found`)
      throw new Error(`Text node ${nodeId} not found`)
    }
    await galleryDb.deleteTextNode(galleryId, { id: nodeId } as Core.TextNode)
    await textNodeDb.delete(nodeId)
    log(7, `successfully deleted text node ${nodeId} from gallery ${galleryId}`)
    return nodeId
  }
}
