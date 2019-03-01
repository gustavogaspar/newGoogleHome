const { dialogflow } = require('actions-on-google');
const bodyParser = require('body-parser');
const app = dialogflow();

module.exports = (serviceConfig) => {

app.intent('Default Fallback Intent',conv =>{
    conv.ask('Funcionou');
});

serviceConfig.use('bot/action',bodyParser.json(),app);
serviceConfig.post('bot/action',app);
}