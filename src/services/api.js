const axios = require('axios')

const api = axios.create({
    baseURL: 'https://lilly-backupbot.herokuapp.com/api'
})

module.exports = api
