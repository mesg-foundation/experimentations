const axios = require('axios')

module.exports = (type, data) => axios.default({
  url: `http://eth-dispatcher.ngrok.io/${type}/register`,
  method: 'POST',
  data
})