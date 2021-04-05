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



app.set('view engine', 'ejs') // Has to go before any app.use, app.get, or app.post methods.
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(bodyParser.json())

app.get('/', (request, response) => {
    console.log("Why you get")
    db.collection('todo-list').find().toArray() // Gives us all items in our db
    .then(item => {
        console.log(item)
        response.render('index.ejs', {chores: item})
    })
    .catch(error => console.log(error))
    
    // response.sendFile(__dirname + '/index.html')
})

app.post('/addItem', (request, response) => {
    console.log(request.body)
    db.collection('todo-list').insertOne(request.body)
    .then(result => {
        console.log(result)
        response.redirect('/')
    })
    .catch(error => console.log(error))
})

app.put('/chores', (request, response) => {
    console.log(response.body)
    db.collection('todo-list').findOutAndUpdate(
        
    )
})

app.listen(process.env.PORT || PORT, ()=> {
    console.log(`Server is running on port ${PORT}.`)
})
