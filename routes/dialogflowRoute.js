const express = require('express');
const router = express.Router();

const { chatCompletion } = require('../helper/openai_api');

router.post('/receiveMessage', async (req, res) => {
    let action = req.body.queryResult.action;
    let queryText = req.body.queryResult.queryText;
    if (action === 'inputUnknown') {
        let result = await chatCompletion(queryText);
        if (result.status == 1) {
            res.send(
                {
                    fulfillmentText: result.response
                }
            );
        } else {
            res.send(
                {
                    fulfillmentText: `Sorry, I'm not able to help with that.`
                }
            );
        }
    } else {
        res.send(
            {
                fulfillmentText: `No handler for the action ${action}.`
            }
        );
    }
});

module.exports = {
    router
};
