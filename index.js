const express = require('express')
const bodyParser = require('body-parser')
const {dialogflow} = require('actions-on-google')
  

const app = dialogflow()

app.intent('Default Fallback Intent', conv => {
    conv.ask('testando')
  })

const expressApp = express().use(bodyParser.json())

expressApp.post('/fulfillment', app)

expressApp.listen(3000)