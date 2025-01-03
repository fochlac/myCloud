export function randomUrl() {
  const datestring = '' + Date.now()
  const randomString = Math.random().toString()
  return (
    '/' +
    Buffer.from(datestring.slice(4, 9) + randomString.slice(3, 5))
      .toString('base64')
      .replace('==', '')
      .replace('/', '_')
  )
}
