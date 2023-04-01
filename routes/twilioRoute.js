const express = require('express');
const router = express.Router();

const { sendTwilioMessage } = require('../helper/twilio_api');
const { getDocument, updateDocument, insertDocument } = require('../helper/mongo_api');
const { detectIntent } = require('../helper/dialogflow_api');

router.post('/receiveMessage', async (req, res) => {
    try {
        let query = req.body.Body;
        let senderId = req.body.From;

        // Get the response from Dialogflow
        let intentData = await detectIntent('en-US', query, senderId);

        // Check user exists
        let user = await getDocument({ senderId: senderId });

        if (intentData.status == 1) {

            // Yes, update the messages
            if (user.status == 1) {
                updateDocument(
                    {
                        senderId: senderId
                    },
                    {
                        messageCount: user.user.messageCount + 1
                    },
                    {
                        query: query,
                        response: intentData.text,
                        createdAt: new Date()
                    }
                );
            }
            // No, create new user with message
            if (user.status == 0) {
                insertDocument(
                    {
                        senderId: senderId,
                        messageCount: 1,
                        channel: 'WhatsApp',
                        isPaid: false,
                        messages: [
                            {
                                query: query,
                                response: intentData.text,
                                createdAt: new Date()
                            }
                        ],
                        name: req.body.ProfileName,
                        mobile: senderId.split(':').pop(),
                        email: ''
                    }
                );
            }
        }
        if (user.status == -1 || intentData.status == 0 || intentData.text === '') {
            sendTwilioMessage('We are facing technical issue at this moment.', senderId);
        } else {
            sendTwilioMessage(intentData.text, senderId);
        }
    } catch (error) {
        console.log(error);
    }
    res.send('OK');
});

module.exports = {
    router
};
