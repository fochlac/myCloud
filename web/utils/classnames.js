export default function cx(...args) {
  return args
    .map(arg =>
      typeof arg === 'object'
        ? Object.keys(arg)
            .filter(key => arg[key])
            .join(' ')
        : arg,
    )
    .join(' ')
}
