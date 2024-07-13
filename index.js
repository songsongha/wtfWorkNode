const rp = require('request-promise');
const cheerio = require('cheerio');
const url = 'https://www.jobbank.gc.ca/marketreport/summary-occupation/21732/ca';

console.log('does this run?')
rp(url)
  .then(function(html){
    //success!
    console.log('does this succeedd?')
    console.log({html})
    const $ = cheerio.load(html)
    console.log($('.heading-info').first().text());
    // console.log($('.section-value:contains("$")').text());
    // console.log($('.section-value:contains("jobs")').text());
    console.log($('.section-value').text());
  })
  .catch(function(err){
    console.log('is there an error?', err)
    //handle error
  });