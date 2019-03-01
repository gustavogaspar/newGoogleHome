const OracleBot = require('@oracle/bots-node-sdk')
const {WebhookClient, WebhookEvent} = OracleBot.Middleware
const { dialogflow } = require('actions-on-google')
const bodyParser = require('body-parser')
const app = dialogflow()


module.exports = (serviceConfig) => {
    const logger = console;

    OracleBot.init(app, {
      logger,
    });
  

    const webhook = new WebhookClient({
      channel: {
        url: 'https://botv2iad1I0100H203896bots-mpaasocimt.botmxp.ocp.oraclecloud.com:443/connectors/v1/tenants/idcs-100b89d671b54afca3069fe360e4bad4/listeners/webhook/channels/d0743e8a-c3f4-4bc8-8b80-bd80794c7a58',
        secret: 'OE2Xqx4YQtfFbiEg0NTVN2u3gImC5egPQ'
      }
    });

    webhook
      .on(WebhookEvent.ERROR, err => logger.error('Error:', err.message))
      .on(WebhookEvent.MESSAGE_SENT, message => logger.info('Message to chatbot:', message))
      .on(WebhookEvent.MESSAGE_RECEIVED, message => logger.info('Message from chatbot:', message))
  
    assistant.intent('Default Fallback Intent', (conv) => {
      logger.info('Got query : ', conv.query);
      const promise = new Promise(function (resolve, reject) {
        const MessageModel = webhook.MessageModel();
        const message = {
          userId: 'Google Home',
          messagePayload: MessageModel.textConversationMessage(conv.query)
        };
        webhook.send(message);
        webhook.on(WebhookEvent.MESSAGE_RECEIVED, message => {
          resolve(message);
        });
      })
        .then(function (result) {
            conv.ask(result.messagePayload.text);
          })
      return promise;
    })


serviceConfig.post('/bot/message', webhook.receiver());
serviceConfig.use('/fulfillment',bodyParser.json(),app);
serviceConfig.post('/fulfillment',app);
}