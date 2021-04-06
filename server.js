
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 8000
require('dotenv').config()


let db
let dbConnectionStr = process.env.DB_STRING
let dbName = 'To-Do-List'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
.then(client => {
    console.log(`Connected to ${dbName} Database`)
    db = client.db(dbName) // collection name
    
})
.catch(error => console.log(error))



app.set('view engine', 'ejs') // Has to go before any app.use, app.get, or app.post methods.
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', async (request, response) => {
    // try {
        const todoItems = await db.collection('todo-list').find().toArray()
        const itemsLeft = await db.collection('todo-list').countDocuments({completed: false})
        response.render('index.ejs', {chores: todoItems, left: itemsLeft})
    // } catch(err) {
    //     console.log(err)
    // }
    
    // db.collection('todo-list').find().toArray() // Gives us all items in our db
    // .then(item => {
    //     response.render('index.ejs', {chores: item})
    // })
    // .catch(error => console.log(error))

})

app.post('/addItem', (request, response) => {
    console.log(request.body)
    db.collection('todo-list').insertOne({todo: request.body.ToDoItem, completed: false})
    .then(result => {
        console.log(`Added ${result}`)
        response.redirect('/')
    })
    .catch(error => console.log(error))
})

app.put('/markComplete', (request, response) => {
    console.log(response.body)
    db.collection('todo-list').updateOne( {todo: request.body.rainbowUnicorn}, {
        $set: {
            completed: true
        }
    })
    .then(result => {
        console.log('Makred Complete')
        response.json('Marked Complete')
    })
    .catch(err => {
        console.log(err)
    })
})

app.put('/undo', (request, response) => {
    db.collection('todo-list').updateOne( {todo: request.body.rainbowUnicorn}, {
        $set: {
            completed: false
        }
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(err => {
        console.log(err)
    })
})

app.delete('/deleteTodo', (request, response) => {
    console.log(request.body.rainbowUnicorn)
    db.collection('todo-list').deleteOne( {todo: request.body.rainbowUnicorn})
    .then(result => {
        console.log('Deleted Todo Item')
        response.json('Delete it')

    })
    .catch(error => {
        console.log(error)
    })
})

app.listen(process.env.PORT || PORT, ()=> {
    console.log(`Server is running on port ${PORT}.`)
})
