const express = require('express');
const router = express.Router();

const RESPONSE = {
    status: 'OK',
    message: 'APIs aer working...'
}

router.get('/', (req, res) => {
    res.status(200).json(RESPONSE);
});

router.post('/', (req, res) => {
    res.status(200).json(RESPONSE);
});

module.exports = {
    router
};
