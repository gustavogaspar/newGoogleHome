const express = require('express')
const service = require('./service')
const serviceConfig = express()

service(serviceConfig)

const server = serviceConfig.listen(process.env.PORT || 3000, () => {
  console.log('Service online\n')
});

module.exports = server