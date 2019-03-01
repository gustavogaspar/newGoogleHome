const OracleBot = require('@oracle/bots-node-sdk')
const {WebhookClient, WebhookEvent} = OracleBot.Middleware
const { dialogflow } = require('actions-on-google')
const bodyParser = require('body-parser')
const app = dialogflow()
const log = console

//Server start
module.exports = (serviceConfig) => {
    //ODA initialization
    OracleBot.init(serviceConfig)

    //Event Handlers
    webhook
        .on(WebhookEvent.ERROR, err => log.error('Error:',err.message))
        .on(WebhookEvent.MESSAGE_RECEIVED, message => log.info('Message to Google:',message))
        .on(WebhookEvent.MESSAGE_SENT, message => log.info('Message from Google:', message))
    
    //Webhook Configuration
    const webhook = new WebhookClient({
        channel: {
            url:'https://botv2iad1I0100H203896bots-mpaasocimt.botmxp.ocp.oraclecloud.com:443/connectors/v1/tenants/idcs-100b89d671b54afca3069fe360e4bad4/listeners/webhook/channels/d0743e8a-c3f4-4bc8-8b80-bd80794c7a58',
            secret:'OE2Xqx4YQtfFbiEg0NTVN2u3gImC5egPQ',
        }
    })
    
    //Step that gets the Google message, parse into ODA structure, and sends to ODA
    //Command that will get the text from google
    app.intent('Default Fallback Intent', conv => {
        //Command that calls the function to parse the message and sends to ODA
        webhook.send(messageParseToODA(conv.query))         
      })
    //Function that parses the message
    function messageParseToODA(text)
    {
        if(!text)
        {
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

    //Step that gets the message from ODA and passes to Google
    webhook.on(WebhookEvent.MESSAGE_RECEIVED, message =>{
        conv.ask(message)
    })
//Oracle Chatbot Endpoint
app.post('/bot/message', webhook.receiver());
//Google Post Endpoint
serviceConfig.use('/fulfillment',bodyParser.json(),app);
serviceConfig.post('/fulfillment',app);
}