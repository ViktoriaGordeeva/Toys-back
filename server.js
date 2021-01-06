const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')


const toyService = require('./services/toyService.js')
const app = express()
const port = process.env.PORT || 3030;

// Config the express App
app.use(cors());
app.use(express.static('public'))
app.use(bodyParser.json())

//LIST
app.get('/toy', (req, res) => {
    const { type, searchTxt, inStock, sortBy } = req.query
    const filterBy = {
        type: type || 'All',
        searchTxt: searchTxt || '',
        sortBy: sortBy || '',
    }
    filterBy.inStock = inStock === 'true' ? true : false

    toyService.query(filterBy)
        .then(toys => {
            res.send(toys)
        })
})

//READ
app.get('/toy/:toyId', (req, res) => {
    const { toyId } = req.params
    toyService.getById(+toyId)
        .then(toy => {
            res.send(toy)
        })
})

//DELETE
app.delete('/toy/:toyId', (req, res) => {
    const { toyId } = req.params

    toyService.remove(toyId)
        .then(() => {
            res.send('Removed Success')
        })

})

app.post('/toy', (req, res) => {
    const toy = req.body

    toyService.save(toy)
        .then(savedToy => {
            res.send(savedToy)
        })
})
app.put('/toy/:id', (req, res) => {
    const toy = req.body

    toyService.save(toy)
        .then(savedToy => {
            res.send(savedToy)
        })
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})