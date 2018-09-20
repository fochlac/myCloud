declare namespace Core {
  interface user {
    id: Id
    name: string
    admin: boolean
  }

  interface ErrorConstructor {
    routerError: (
      level: number,
      res: Express.Response,
      ...message: Array<any>
    ) => (error: any) => void
    internalError: (level: number, ...message: Array<any>) => (error: any) => void
  }

  type Path = string
  type Id = string

  interface User {
    name: string
    id: Id
    urls: AccessUrl[]
  }

  interface RawUser {
    name: string
    id: Id
    hash: string
    salt: string
    urls: Id[]
  }

  interface Gallery {
    name: string
    id: Id
    description?: string
    path: Path
    parent: Id
    images: Image[]
    urls: AccessUrl[]
    ancestors: Id[]
    children: Id[]
    accessToken?: AccessUrl
  }

  interface BareGallery {
    name: string
    id: Id
    description?: string
    path: Path
    parent: Id
    images: Id[]
    urls: Id[]
    ancestors: Id[]
    children: Id[]
  }

  interface Image {
    path: Path
    id: Id
    gallery: Id
    created: string
    name: string
    description: string
    lastModified: number
  }

  interface AccessUrl {
    url: string
    gallery: Id
    id: Id
    access: 'read' | 'write'
    recursive: boolean
  }

  interface AccessMap {
    [key: string]: AccessUrl
  }

  interface ObjectMap {
    [key: string]: any
  }

  class FileDb {
    set: (id: Id, value: any) => Promise<any>
    setMultiple: (update: ObjectMap) => Promise<{ [id: string]: any }>
    nextIndex: Id
    delete: (id: Id) => Promise<Id>
    list: () => any[]
    get: (id: Id) => any
    find: (key: string, value: any) => any[]
  }

  class GalleryDb {
    db: FileDb
    get: (id: Id) => Gallery
    list: () => [Gallery]
    delete: (id: Id) => Promise<Id>
    insertImage: (id: Core.Id, image: Core.Image) => Promise<Core.Gallery>
    deleteImage: (id: Core.Id, image: Core.Image) => Promise<Core.Gallery>
    insertAccessUrl: (id: Core.Id, url: Core.AccessUrl) => Promise<Core.Gallery>
    deleteAccessUrl: (id: Core.Id, url: Core.AccessUrl) => Promise<Core.Gallery>
    update: (rawGallery: object) => Promise<Gallery[]>
    create: (rawGallery: object) => Promise<Gallery[]>
  }

  class ImageDb {
    db: FileDb
    get: (id: Id) => Image
    list: () => Image[]
    delete: (id: Id) => Promise<Id>
    update: (rawImage: object) => Promise<Image>
    create: (rawImage: object) => Promise<Image>
  }

  class UrlDb {
    db: FileDb
    get: (id: Id) => AccessUrl
    list: () => AccessUrl[]
    find: (key: string, value: any) => AccessUrl[]
    delete: (id: Id) => Promise<Id>
    update: (rawAccessUrl: object) => Promise<AccessUrl>
    create: (rawAccessUrl: object) => Promise<AccessUrl>
  }

  class UserDb {
    db: FileDb
    get: (id: Id) => RawUser
    list: () => RawUser[]
    find: (key: string, value: any) => RawUser[]
    delete: (id: Id) => Promise<Id>
    update: (rawUser: object) => Promise<RawUser>
    create: (rawUser: object) => Promise<RawUser>
  }

  interface RawGallery {
    name: string
    id?: Id
    description?: string
    parent?: Id
  }

  interface WebToken {
    accessMap: AccessMap
    user?: Id
    iss?: string
    iat?: number
  }

  interface Dimensions {
    width?: number
    height?: number
  }

  interface ValidationInfo {
    type: 'REGEXP' | 'ONEOF'
    regexp?: RegExp
    list?: string[]
    allowUndefined: boolean
  }

  interface ValidationMap {
    [property: string]: ValidationInfo
  }

  interface RequestValidationMap {
    body?: ValidationMap
    params?: ValidationMap
    query?: ValidationMap
  }
}
