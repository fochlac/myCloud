declare namespace Core {
  interface user {
    id: Id
    name: string
    admin: boolean
  }

  interface ErrorConstructor {
    internalError: Function
    routerError: Function
  }

  type Path = string
  type Id = string

  interface Gallery {
    name: string
    id: Id
    description?: string
    path: Path
    parent: Id
    images: [Image]
    urls: [AccessUrl]
    ancestors: [Id]
  }

  interface Image {
    path: Path
    id: Id
    gallery: Id
    name: string
    description: string
  }

  interface AccessUrl {
    url: string
    gallery: Id
    id: Id
    access: 'read' | 'write'
    recursive: boolean
  }

  interface AccessMap {[key: Gallery['id']]: Gallery;}

  class FileDb {
    set: (id: Id, value: any) => Promise<any>
    nextIndex: Id
    delete: (id: Id) => Promise<Id>
    list: () => [any]
    get: (id: Id) => any
    find: (key: string, value: any) => [any]
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
    update: (rawGallery: object) => Promise<Gallery>
    create: (rawGallery: object) => Promise<Gallery>
  }

  class ImageDb {
    db: FileDb
    get: (id: Id) => Image
    list: () => [Image]
    delete: (id: Id) => Promise<Id>
    update: (rawImage: object) => Promise<Image>
    create: (rawImage: object) => Promise<Image>
  }

  class UrlDb {
    db: FileDb
    get: (id: Id) => AccessUrl
    list: () => [AccessUrl]
    find: (key: string, value: any) => [AccessUrl]
    delete: (id: Id) => Promise<Id>
    update: (rawAccessUrl: object) => Promise<AccessUrl>
    create: (rawAccessUrl: object) => Promise<AccessUrl>
  }

  interface RawGallery {
    name: string
    id?: Id
    description?: string
    parent?: Id
  }

  interface WebToken {
    accessMap: AccessMap
  }

  interface Request extends Express.Request {
    token: WebToken
    authenticated: boolean
  }
}
