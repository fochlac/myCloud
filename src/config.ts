global.port = process.env.ORGANI_PORT ? +process.env.ORGANI_PORT : 8080
global.address = process.env.ORGANI_ADDRESS || 'localhost'
global.logLevel = +process.env.ORGANI_LOGLEVEL || 6
global.secretKey = process.env.ORGANI_SECRET || 'awdwqe1289389ghdhsd09as9u323h9'
global.appRoot = process.env.ORGANI_APPROOT || 'c:\\organi\\'
global.storage = process.env.ORGANI_STORAGE || 'c:\\organi\\storage\\'
