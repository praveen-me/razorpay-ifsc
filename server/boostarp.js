// const fs = require('fs');
// const https = require('https');

// module.exports = () => {
//   const data = fs.readFileSync('./server/IFSC-list.txt');
//   const IFSCARR = [...new Set(String(data).split('\n'))];
//   IFSCARR.forEach((ifsc) => {
//     https.get(`https://ifsc.razorpay.com/${ifsc}`, (bankData) => {
//       bankData.on('data', (d) => {
//         const bank = JSON.parse(String(d));
//         const newBank = new Bank({
//           IFSC: bank.IFSC,
//           BANK: bank.BANK,
//           CITY: bank.CITY,
//         });
//         newBank.save();
//       });
//     });
//   });
// };
var fs = require('fs');
var axios = require('axios');
var async = require('async');
const Bank = require('./models/Bank');
var codes;
var counter = 52589;
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// 9468

module.exports = () => {
  fs.readFile('./server/IFSC-list.txt', (err, data) => {
    if (err) throw err;
    codes = data.toString().split("\n");
    let newCodes = codes.slice(52589);
    async.eachSeries(newCodes, (ifsc, callback) => {
      console.log(ifsc, 'ON');
      axios.get(`https://ifsc.razorpay.com/${ifsc}`)
      .then(function (response) {
        const {IFSC, BANK, CITY} = response.data;
        var newBank = new Bank({
          IFSC,
          BANK,
          CITY
        });
        newBank.save();
        console.log('saved', ++counter);
        callback();
      })
      .catch(function (error) {
        console.log(error);
      });
    });
  });
}