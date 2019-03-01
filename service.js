const { dialogflow } = require('actions-on-google');
const bodyParser = require('body-parser');
const app = dialogflow();

module.exports = (serverConfig) => {

app.intent('Default Fallback Intent',conv =>{
    conv.ask('Funcionou');
});

serverConfig.use('bot/action',bodyParser.json(),app);
serverConfig.post('bot/action',app);
}