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
  type Id = number

  interface Gallery {
    name: string
    id: Id
    description?: string
    path: Path
    parent: Id
    images: [Image]
    urls: [AccessUrl]
  }

  interface Image {
    path: Path
    id: Id
    name: string
    description: string
  }

  interface AccessUrl {
    url: string
    gallery: Id
    access: 'read' | 'write'
    recursive: boolean
  }

  class FileDb {
    set: (id: Id, value: any) => Promise<any>
    nextIndex: Id
    delete: (id: Id) => Promise<Id>
    list: () => [any]
    get: (id: Id) => any
    find: (key: string, value: string) => [any]
  }

  class GalleryDb {
    db: FileDb
    get: (id: Id) => Gallery
    list: () => [Gallery]
    delete: (id: Id) => Promise<Id>
    update: (rawGallery: object) => Promise<Gallery>
    create: (rawGallery: object) => Promise<Gallery>
  }

  interface RawGallery {
    name: string
    id?: Id
    description?: string
    parent?: Id
  }
}
