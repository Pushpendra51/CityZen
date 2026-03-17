const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

console.log('--- Env Check ---');
console.log('TWILIO_ACCOUNT_SID:', JSON.stringify(process.env.TWILIO_ACCOUNT_SID));
console.log('TWILIO_AUTH_TOKEN:', JSON.stringify(process.env.TWILIO_AUTH_TOKEN));
console.log('TWILIO_PHONE_NUMBER:', JSON.stringify(process.env.TWILIO_PHONE_NUMBER));
console.log('--- Logic Check ---');

const sid = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;
const phone = process.env.TWILIO_PHONE_NUMBER;

if (sid && token && phone) {
    console.log('Twilio block WOULD execute.');
} else {
    console.log('Twilio block WOULD remain in simulation.');
}
