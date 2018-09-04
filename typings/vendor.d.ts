declare namespace NodeJS {
  interface Global {
    port: number
    address: string
    logLevel: number
    secretKey: string
    appRoot: string
    storage: string
  }
}
