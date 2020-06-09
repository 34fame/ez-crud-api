# ez-crud-api

This project creates a very simple but flexible Node.js/Express REST API service with built-in CRUD endpoints.  The idea
 was to give a UI developer a quick and simple way to get an API up and running to start developing against.  Unlike a
  mock API the data can persist but doesn't require a third-party database or any other external dependency.
  
## Installation

```shell script
> git clone https://github.com/34fame/ez-crud-api
> cd ez-crud-api
> npm install
```

## Getting Started

Before starting the service you need to define your database seed.  By default the `./seeds/hrms-empty.json` is used
 to create the initial database.  You can modify or create additional seed json files.
 
If you change seed files you will need to update the `./lowdb.js` to import it.  Simply update the following line
 with the appropriate seed file:
 ```js
const seed = require("./seeds/hrms-empty")
```

Now you can start the service:
```shell script
> npm run start
```

By default the service will run on port 3000 but you can change this inside the `index.js` file:
```js
const port = 3000  // Change this value to run service on a different local port
```

## Default Endpoints

For the sake of these examples I'll assume you are using the default `hrms-empty.json` file to seed your database
.  If not, the same calls are available, but your collection names may be different.  A "collection" is the top-level
 keys of your JSON seed file.  By default, you have a "users", "departments", "locations" and "positions" collection.
 
 ```js
module.exports = {
   users: [],
   departments: [],
   locations: [],
   positions: []
}
```

Now we can start managing our object.

### Get Collection Items
Returns all collection items.

Request
```shell script
GET /users
Host: http://localhost:3000
Accept: application/json
```

Response
```json
[
   {
      "firstName": "Troy",
      "lastName": "Moreland",
      "id": "<uuid>"
   }
]
```

### Get Collection Item
Returns a single item by its id.

Request
```shell script
GET /users/:id
Accept: application/json
```

Response
```json
{
   "firstName": "Troy",
   "lastName": "Moreland",
   "id": "<uuid>"
}
```

### Get Collection Items Count
Returns the number of items in a collection.

Request
```shell script
GET /users/count
Accept: text/plain
```

Response
```shell script
3
```

### Search Collection Items
Returns all items meeting the defined criteria.

The search criteria consists of three query parameters: `filter`, `sortBy` and `take`.  These verbs come from the
 __lodash__ library.
 
 The `filter` parameter must be JSON that is base64 encoded.  To find everyone with the first name of "Troy" you
  would use `{ "firstName": "Troy" }`.  Then base64 encode the entire filter.  You can add more fields to the filter,
   and they will act as an AND search.
   
Set the sort results by passing the sort field name to the `sortBy` parameter.  You can only sort with one field.
 
The `take` parameter is like `limit` for databases.  Set this parameter to the max number of objects you want returned.

JavaScript Base64 Encoding example
```js
let filter = { "firstName": "Troy", "lastName": "Moreland" }
filter = Buffer.from(filter).toString('base64')
// returns eyAiZmlyc3ROYW1lIjogIlRyb3kiLCAibGFzdE5hbWUiOiAiTW9yZWxhbmQiIH0=
```

Request
```shell script
GET /users/search?filter=eyAiZmlyc3ROYW1lIjogIlRyb3kiLCAibGFzdE5hbWUiOiAiTW9yZWxhbmQiIH0=
Accept: application/json
```

Response
```json
[
   {
      "firstName": "Troy",
      "lastName": "Moreland",
      "id": "<uuid>"
   }
]
```

Request
```shell script
GET /users/search?sortBy=lastName&take=10
Accept: application/json
```

### Create Collection Item

Request
```shell script
POST /users
Content-Type: application/json
Accept: application/json
{
   "firstName": "Troy",
   "lastName": "Moreland"
}
```

Response
```json
{
   "firstName": "Troy",
   "lastName": "Moreland",
   "id": "<uuid>"
}
```

The object can be any json structure you want.  The only constraint is that you must seed your database with your
 collections.  What you put in them is totally up to you.  An "id" value will be generated for every new collection
  item.
  

### Update Collection Item
Updates an item and returns the entire object.

The value passed to the endpoint will be merged with the existing object.

```shell script
PUT /users/:id
Accept: application/json
Content-Type: application/json
{
   "active": false
}
```

### Delete Collection Item
Deletes an item and returns the entire object deleted.

```shell script
DELETE /users/:id
Accept: application/json
```

