export const DAY_IN_MS = 24 * 60 * 60 * 1000
export const MAX_GAP_DAYS = 7

export function getSortedItems(gallery) {
  const images = gallery.get('images').toArray()
  const textNodes = gallery.get('textNodes', []).toArray()

  return [...images, ...textNodes].filter(a => a.get('dateTime') || a.get('imageTaken')).sort((a, b) => {
    const aTime = a.get('dateTime') || a.get('imageTaken')
    const bTime = b.get('dateTime') || b.get('imageTaken')
    return aTime - bTime
  })
}

export function clusterItems(items, clusterThreshold = MAX_GAP_DAYS) {
  const clusters = []
  let currentCluster = {
    title: null,
    segments: []
  }
  let currentSegment = null
  let previousTime
  items.forEach((item, index) => {
    const isImage = item.has('path') && item.has('name') && !item.has('type')
    const currentTime = isImage ? item.get('imageTaken') : item.get('dateTime')

    // Skip items without valid time
    if (!currentTime) return

    // Check if we need to start a new cluster
    const shouldStartNewCluster =
      index === 0 ||
      (item && item.get('type') === 'title') ||
      (previousTime && (currentTime - previousTime) > Number(clusterThreshold) * DAY_IN_MS)


    if (shouldStartNewCluster) {
      currentCluster.endDateTime = previousTime
      if (currentCluster.segments.length || currentCluster.title) {
        clusters.push(currentCluster)
      }
      currentCluster = {
        title: null,
        dateTime: isImage ? item.get('imageTaken') : item.get('dateTime'),
        segments: []
      }
      currentSegment = null
    }

    previousTime = currentTime

    // Handle different item types
    if (item.get('type') === 'title') {
      currentCluster.title = item
    } else if (isImage) {
      // Add image to existing image segment or create new one
      if (currentSegment && currentSegment.type === 'images') {
        currentSegment.images.push(item)
      } else {
        currentSegment = {
          type: 'images',
          images: [item]
        }
        currentCluster.segments.push(currentSegment)
      }
    } else {
      // Text node - always creates a new segment
      currentSegment = {
        type: 'text',
        node: item
      }
      currentCluster.segments.push(currentSegment)
    }
  })

  // Add final cluster
  if (currentCluster.segments.length) {
    currentCluster.endDateTime = previousTime
    clusters.push(currentCluster)
  }

  return clusters
}
