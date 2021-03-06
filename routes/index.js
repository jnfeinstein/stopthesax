const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const twilio = require('twilio');
const config = require('../config');
const moment = require('moment-timezone')

const { addRow } =  require("../google/sheets");

const twilioClient = new twilio(config.twilioAccontSid, config.twilioAuthToken);

const textDelayMin = 60;
const textDelayMs = textDelayMin * 60 * 1000;
let lastTextedAt = null;

function randomValueHex (len) {
  // https://blog.tompawlak.org/generate-random-values-nodejs-javascript
  return crypto.randomBytes(Math.ceil(len/2))
    .toString('hex') // convert to hexadecimal format
    .slice(0,len);   // return required number of characters
}

function text() {
  const now = new Date();

  if (now - lastTextedAt >= textDelayMs) {
    console.log('Sending text');

    twilioClient.messages.create({
      to: '+18583956393',
      from: '+16193831195',
      body: 'STOP PLAYING SAXOPHONE!'
    });

    lastTextedAt = now;
  } else {
    const timeLeft = textDelayMs - (now - lastTextedAt);
    console.log(`Skipping text for ${timeLeft / 1000}s`);
  }
}

function timeStr() {
  return moment().tz('America/Los_Angeles').format();
}

function ips(req) {
  return req.header('CF-Connecting-IP') || req.ip;
}

router.get('/', (req, res) => {
  res.render('index', { txId: randomValueHex(8) });
});

router.post('/halt', (req, res) => {
  text();

  addRow(1, {
    ip: ips(req),
    time: timeStr(),
    txId: req.body.txId,
    halt: true
  });

  res.render('halt', { txId: req.body.txId });
});

router.post('/feedback', (req, res) => {
  addRow(1, {
    ip: ips(req),
    time: timeStr(),
    txId: req.body.txId,
    loud: req.body.type === 'loud' ? true : undefined,
    soft: req.body.type === 'soft' ? true : undefined,
    request: req.body.request,
    other: req.body.other
  });

  res.redirect('/done');
});

router.post('/contact', (req, res) => {
  addRow(1, {
    ip: ips(req),
    time: timeStr(),
    txId: req.body.txId,
    contact: req.body.contact
  });

  res.redirect('/done');
});

router.get('/done', (req, res) => {
  res.render('done');
});

module.exports = router;
