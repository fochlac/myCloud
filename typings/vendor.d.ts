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

declare namespace Express {
  export interface Request {
    token: Core.WebToken
    authenticated: boolean
    path: string
    accessToken: Core.AccessUrl
    user?: Core.User
    startGallery?: Core.Id
    params?: Params
    cookies?: {
      jwt?: string
    }
  }

  interface Params {
    [key: string]: any
  }

  export interface Response {
    cookie: (name: string, val: string, options: object) => Response
    set: (name: string, val: string) => Response
    headers: object
    status: Function
  }
}
