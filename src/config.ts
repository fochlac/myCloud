global.port = process.env.GALLERY_PORT ? +process.env.GALLERY_PORT : 8080
global.address = process.env.GALLERY_ADDRESS || 'localhost'
global.logLevel = +process.env.GALLERY_LOGLEVEL || 6
global.secretKey = process.env.GALLERY_SECRET || 'awdwqe1289389ghdhsd09as9u323h9'
global.appRoot = process.env.GALLERY_APPROOT || 'c:\\github\\gallery\\'
global.storage = process.env.GALLERY_STORAGE || 'c:\\github\\gallery\\storage\\'
