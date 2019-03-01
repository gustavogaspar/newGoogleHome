const OracleBot = require('@oracle/bots-node-sdk')
const {WebhookClient, WebhookEvent} = OracleBot.Middleware
const { dialogflow } = require('actions-on-google')
const bodyParser = require('body-parser')
const app = dialogflow()
const log = console

module.exports = (serviceConfig) => {
    OracleBot.init(serviceConfig)

    const webhook = new WebhookClient({
        channel: {
            url:'https://botv2iad1I0100H203896bots-mpaasocimt.botmxp.ocp.oraclecloud.com:443/connectors/v1/tenants/idcs-100b89d671b54afca3069fe360e4bad4/listeners/webhook/channels/d0743e8a-c3f4-4bc8-8b80-bd80794c7a58',
            secret:'OE2Xqx4YQtfFbiEg0NTVN2u3gImC5egPQ',
        }
    })

    webhook
        .on(WebhookEvent.ERROR, err => log.error('Error:',err.message))
        .on(WebhookEvent.MESSAGE_RECEIVED, message => log.info('Message to Google:',message))
        .on(WebhookEvent.MESSAGE_SENT, message => log.info('Message from Google:', message))
    

    app.intent('Default Fallback Intent', conv => {
        const promise = new Promise(function(resolve,reject){
             webhook.send(messageParseToODA(conv.query))
             webhook.on(WebhookEvent.MESSAGE_RECEIVED, message => resolve(message))
             function messageParseToODA(text)
            {
                if(!text)
                {
                    console.log('The message wasnt parsed correctly')
                    conv.close('The message wasnt parsed correctly')
                }
                else
                {
                const messageModel=webhook.MessageModel()
                const message= {
                    userId: "Google Home",
                    messagePayload: messageModel.textConversationMessage(text)
                    }
                return message
                }
            }
        })
        .then(function (result){
            conv.ask(result.messagePayload.text)
        })
        return promise;
      })
    

//Oracle Chatbot Endpoint
serviceConfig.post('/bot/message', webhook.receiver());
//Google Post Endpoint
serviceConfig.use('/fulfillment',bodyParser.json(),app);
serviceConfig.post('/fulfillment',app);
}