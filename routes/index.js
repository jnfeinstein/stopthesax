const express = require('express');
const router = express.Router();
const request = require('request');
const crypto = require('crypto');
const twilio = require('twilio');
const config = require('../config');

const twilioClient = new twilio(config.twilioAccontSid, config.twilioAuthToken);

const textDelay = 15 * 60 * 1000; // ms
let lastTextedAt = null;

function randomValueHex (len) {
  // https://blog.tompawlak.org/generate-random-values-nodejs-javascript
  return crypto.randomBytes(Math.ceil(len/2))
    .toString('hex') // convert to hexadecimal format
    .slice(0,len);   // return required number of characters
}

router.get('/', function(req, res) {
  res.render('index', { txId: randomValueHex(8) });
});

router.post('/halt', (req, res) => {
  res.render('halt', { txId: req.body.txId });

  const now = new Date();

  if (now - lastTextedAt >= textDelay) {
    console.log('Sending text');

    twilioClient.messages.create({
      to: '+18583956393',
      from: '+16193831195',
      body: 'STOP PLAYING SAXOPHONE!'
    });

    lastTextedAt = now;
  } else {
    const timeLeft = textDelay - (now - lastTextedAt);
    console.log(`Skipping text for ${timeLeft / 1000}s`);
  }
});

router.post('/feedback', (req, res) => {
  res.render('done');
});

router.post('/contact', (req, res) => {
  res.render('done');
});

module.exports = router;
