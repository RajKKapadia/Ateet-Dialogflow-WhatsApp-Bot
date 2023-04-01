require('dotenv').config();

const ACCOUNT_SID = process.env.ACCOUNT_SID;
const AUTH_TOKEN = process.env.AUTH_TOKEN;
const FROM = process.env.FROM; 

const client = require('twilio')(ACCOUNT_SID, AUTH_TOKEN, { 
    lazyLoading: true 
});

const sendTwilioMessage = async (message, senderId) => {
    try {
        await client.messages.create({
            to: senderId,
            body: message,
            from: FROM
        });
    } catch (error) {
        console.log(`Error at sendMessage --> ${error}`);
    }
};

module.exports = {
    sendTwilioMessage
}
