export default function cx(...classNames) {
  return classNames.filter(classname => !!(classname && classname.length)).join(' ')
}
