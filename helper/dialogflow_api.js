const dialogflow = require('@google-cloud/dialogflow');
require('dotenv').config();

const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

const PROJECID = CREDENTIALS.project_id;

const CONFIGURATION = {
    credentials: {
        private_key: CREDENTIALS.private_key,
        client_email: CREDENTIALS.client_email
    }
};

const sessionClient = new dialogflow.SessionsClient(CONFIGURATION);

const detectIntent = async (languageCode, queryText, sessionId) => {

    let sessionPath = sessionClient.projectAgentSessionPath(PROJECID, sessionId);

    let request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: queryText,
                languageCode: languageCode,
            },
        },
    };

    try {
        const responses = await sessionClient.detectIntent(request);
        const result = responses[0].queryResult;
        return {
            status: 1,
            text: result.fulfillmentText,
            queryText: result.queryText,
            intentName: result.intent.displayName,
            intentDetectionConfidence: result.intentDetectionConfidence
        };
    } catch (error) {
        console.log(`Error at dialogflow_api.js detectIntent --> ${error.message}`);
        return {
            status: 0,
            text: {},
            queryText: '',
            intentName: '',
            intentDetectionConfidence: 0
        };
    }
};

module.exports = {
    detectIntent
};
