const low = require("lowdb")
const FileSync = require("lowdb/adapters/FileSync")

const adapter = new FileSync('db/db.json')
const db = low(adapter)

const seed = require("./seeds/hrms-empty")

db.defaults(seed).write()

module.exports = db
