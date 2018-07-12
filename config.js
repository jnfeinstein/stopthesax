module.exports = {
  twilioAccontSid: process.env.TWILIO_ACCOUNT_SID || null,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || null,
  // an optional security measure - if both are set, then recaptcha will be used.
  recaptchaSiteKey: process.env.RECAPTCHA_SITE || null,
  recaptchaSecretKey: process.env.RECAPTCHA_SECRET || null,
  subpath: process.env.SUBPATH || "/"
};
