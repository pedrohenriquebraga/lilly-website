const express = require('express')
const cors = require('cors')
const path = require('path')

const compression = require('compression')
const zlib = require('zlib')

const app = express()

app.use(cors())
app.disable('x-powered-by')
app.use(compression({ level: 9 }))
app.use(express.static(path.join(__dirname, '..', 'public')))

// Rota Principal
app.get('/', (req, res) => {
    return res.sendFile(__dirname + '/views/index.html')
})

// Rota para mostrar comandos
app.get('/commands', (req, res) => {
    return res.sendFile(__dirname + '/views/commands.html')
})

app.listen(process.env.PORT || 3000)
