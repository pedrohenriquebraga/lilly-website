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
    return res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

// Rota para mostrar comandos
app.get('/commands', (req, res) => {
    return res.sendFile(path.join(__dirname, 'views', 'commands.html'))
})

// Convite da Lilly
app.get('/invite', (req, res) => {
    return res.redirect('https://discord.com/api/oauth2/authorize?client_id=754548334328283137&permissions=8&scope=bot')
})

app.get('/support', (req, res) => {
    return res.redirect('https://discord.gg/SceHNfZ')
})

app.get('/community-terms', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'communityTerms.html'))
})

app.get('/privacy-policy', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'privacyPolicy.html'))
})

app.listen(process.env.PORT || 3000)
