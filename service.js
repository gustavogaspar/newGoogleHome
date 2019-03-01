const { dialogflow } = require('actions-on-google');
const bodyParser = require('body-parser');
const app = dialogflow();

module.exports = (serviceConfig) => {

    app.intent('Default Fallback Intent', conv => {
        conv.ask(`Funciona sua porra veia`)
      })

serviceConfig.use('/fulfillment',bodyParser.json(),app);
serviceConfig.post('/fulfillment',app);
}