const express = require("express")
const { v4: uuid } = require("uuid")

const db = require("./lowdb")

const app = express()
const port = 3000
app.use(express.json())

// Get all collection items
app.get('/:collection', (req, res) => {
   const collection = req.params.collection
   res.send(db.get(collection))
})

// Get collection item count
app.get('/:collection/count', (req, res) => {
   const collection = req.params.collection
   res.send(db.get(collection).size().value())
})

// Query collection items
app.get('/:collection/search', (req, res) => {
   // filter={ field: value, field: value, ... } <-- base64 encoded value
   // sortBy='field'
   // take='5'
   const collection = req.params.collection
   let dbRef = db.get(collection)
   if (req.query.filter) {
      let filter = Buffer.from(req.query.filter, 'base64').toString()
      filter = JSON.parse(filter)
      dbRef = dbRef.filter(filter)
   }
   if (req.query.sortBy) {
      dbRef = dbRef.sortBy(req.query.sortBy)
   }
   if (req.query.take) {
      dbRef = dbRef.take(Number(req.query.take))
   }
   res.send(dbRef)
})

// Get collection item
app.get('/:collection/:id', (req, res) => {
   const collection = req.params.collection
   const id = req.params.id
   let item = db.get(collection).find({ id }).value()
   if (item) {
      res.send(item)
   } else {
      res.status(404).send('Item not found')
   }
})

// Create collection item
app.post('/:collection', (req, res) => {
   const collection = req.params.collection
   let item = req.body
   let id = uuid()
   item.id = id
   db.get(collection)
      .push(item)
      .write()
   item = db.get(collection).find({ id }).value()
   res.send(item)
})

// Update collection item
app.put('/:collection/:id', (req, res) => {
   const collection = req.params.collection
   const id = req.params.id
   let item = req.body
   db.get(collection)
   .find({ id })
   .assign(item)
   .write()
   item = db.get(collection).find({ id }).value()
   res.send(item)
})

// Delete collection item
app.delete('/:collection/:id', (req, res) => {
   const collection = req.params.collection
   const id = req.params.id
   let result = db.get(collection).remove({ id }).write()
   if (result) {
      if (result.length) {
         res.send('Delete successful')
      } else {
         res.status(404).send('Invalid request')
      }
   } else {
      res.status(400).send('Delete failed')
   }
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
