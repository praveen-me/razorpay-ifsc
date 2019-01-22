const fs = require('fs');
const https = require('https');
const Bank = require('./models/Bank');

module.exports = () => {
  const data = fs.readFileSync('./server/IFSC-list.txt');
  const IFSCARR = [...new Set(String(data).split('\n'))];
  IFSCARR.forEach((ifsc) => {
    https.get(`https://ifsc.razorpay.com/${ifsc}`, (bankData) => {
      bankData.on('data', (d) => {
        const bank = JSON.parse(String(d));
        const newBank = new Bank({
          IFSC: bank.IFSC,
          BANK: bank.BANK,
          CITY: bank.CITY,
        });
        newBank.save();
      });
    });
  });
};
