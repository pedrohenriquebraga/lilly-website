const axios = require('axios')

const api = axios.create({
    baseURL: 'https://lilly-discordbot.herokuapp.com/api'
})

module.exports = api