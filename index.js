const express = require('express')
const service = require('./service')
const logger = console
const serverConfig = express()

service(serverConfig)

const server = serverConfig.listen(process.env.PORT || 3000, () => {
  logger.info('serviço online');
});

module.exports = server;