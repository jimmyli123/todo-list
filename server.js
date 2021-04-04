const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 8000


app.use(bodyParser.urlencoded({ extended: true }))

let db
let dbConnectionStr = 'mongodb+srv://Jimmy:demo@cluster0.k3eyb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
let dbName = 'To-Do-List'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
.then(client => {
    console.log(`Connected to ${dbName} Database`)
    db = client.db(dbName) // Database name
    const toDoCollection = db.collection('todo-list')   // Collection name
    
})
.catch(error => console.log(error))



app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (request, response) => {
    console.log("Why you get")
    response.sendFile(__dirname + '/index.html')
})

app.post('/addItem', (request, response) => {
    console.log(request.body)
    db.collection('todo-list').insertOne(request.body)
    .then(result => {
        console.log(result)
    })
    .catch(error => console.log(error))
})

app.listen(process.env.PORT || PORT, ()=> {
    console.log(`Server is running on port ${PORT}.`)
})
