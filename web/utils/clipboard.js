export default function copy(text) {
  const input = document.createElement('textarea')
  input.style.position = 'absolute'
  input.style.opacity = 0
  input.innerText = text
  document.body.appendChild(input)
  input.focus()
  input.select()
  document.execCommand('copy')
  document.body.removeChild(input)
}
