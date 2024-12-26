
function pad(n) {
  const length = Math.max(2, String(n).length)
  return `00${n}`.slice(-length)
}

export function dateHumanized(unixStamp) {
  const date = new Date(Number(unixStamp))

  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${String(date.getFullYear()).slice(-2)}`
}
