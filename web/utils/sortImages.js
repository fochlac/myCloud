export function sortImages(a, b) {
  return a.get('name').localeCompare(b.get('name'))
}
