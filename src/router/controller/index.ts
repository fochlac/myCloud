import { readFile } from 'fs-extra'
import { join } from 'path'
import { ReadAll } from 'controller/gallery'
import { sanitizeHtml } from 'utils/sanitize'

export async function serveIndex(req, res) {
  const file = await readFile(join(global.appRoot, 'static/index.html'), 'utf8')
  const galleries = req.token
    ? ReadAll(req.token.accessMap).reduce((galleries, gallery) => {
        galleries[gallery.id] = gallery
        return galleries
      }, {})
    : {}

  res.status(200).send(
    file.replace(
      '<script>/**DEFAULTSTORE**/</script>',
      `<script>
      window.defaultStore = {
                  app:{
                    busy: []
                  },
                  galleries:${sanitizeHtml(JSON.stringify(galleries))}
                }
          </script>`,
    ),
  )
}
