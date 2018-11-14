import { ReadAll } from './gallery'
import { join } from 'path'
import { readFile } from 'fs-extra'
import { sanitizeHtml } from '../../utils/sanitize'
import logger from '../../utils/logger'

const log = (level, ...message) => logger(level, 'controller/index.ts -', ...message)

export async function serveIndex(req, res) {
  const file = await readFile(join(global.appRoot, 'static/index.html'), 'utf8')
  const galleries = req.token
    ? ReadAll(req.token.accessMap).reduce((galleries, gallery) => {
        galleries[gallery.id] = gallery
        return galleries
      }, {})
    : {}

  log(7, `sent index.html with ${Object.values(galleries).length} galleries to user ${req.user && req.user.id || 'unregistered'}`)

  res.status(200).send(
    file.replace(
      '<script>/**DEFAULTSTORE**/</script>',
      `<script>
      window.defaultStore = {
                  app:{
                    busy: [],
                    hd: !localStorage || (localStorage.hd !== 'false' && true),
                    ${req.startGallery ? `startGallery: ${req.startGallery},` : ''}
                  },
                  galleries:${sanitizeHtml(JSON.stringify(galleries))},
                  user:${req.user ? sanitizeHtml(JSON.stringify(req.user)) : '{}'},
                  uploadQueue: {},
                }
        </script>`,
    ),
  )
}
