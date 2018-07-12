const express = require('express');
const router = express.Router();
const request = require('request');
const crypto = require('crypto');

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
});

router.post('/feedback', (req, res) => {
  res.render('done');
});

router.post('/contact', (req, res) => {
  res.render('done');
});

module.exports = router;
