const axios = require('axios')

module.exports = data => axios({
  method: 'POST',
  url: data.endpoint,
  headers: data.headers,
  data: data.payload
})
  .then(response => response.data)