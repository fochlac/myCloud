import log from 'SERVER/utils/logger'

const error = (location: string): Core.ErrorConstructor => ({
  internalError: (level: number, ...message: Array<string>): Function => (detail: Error): void => {
    log(level, location, ...message, detail)
  },
  routerError: (level: number, res, ...message: Array<string>): Function => (detail: Error): void => {
    log(level, location, ...message, detail)
    res.status(500).send()
  },
})

export default error
