const rp = require('request-promise');
const cheerio = require('cheerio');
const url = 'https://www.jobbank.gc.ca/marketreport/summary-occupation/2133/ca';

rp(url)
  .then(function(html){
    const $ = cheerio.load(html)
    const jobTitle = $('.heading-info').text().trim().replace(' in Canada', '');
    const requirements = $('#j_id_2n_2_25 .section-value').text().trim(); // sometimes comes up as management
    const wageString = $('#j_id_2n_2_2c .section-value').text().trim();
    const wageUnit = wageString.replace(/[$.,/0-9 ]/g,'')
    const wage = Number(wageString.replace(/[$,/a-z ]/g,''))
    let wageHour = 0;
    let wageYear = 0;
    if (wageUnit === 'hour'){
        wageHour = wage;
        wageYear = wage * 2000;
    } else if (wageUnit === 'year'){
        wageYear = wage;
        wageHour = wage / 2000;
    } 

    console.log({wageUnit})
    console.log({wage})
    console.log({wageHour})
    console.log({wageYear})
    
    const numPosting = Number($('#j_id_2n_2_44 .section-value').text().trim().split(' ')[0]);
    console.log({jobTitle})
    console.log({requirements})
    console.log({wage})
    console.log({numPosting})
  })
  .catch(function(err){
    console.log('is there an error?', err)
    //handle error
  });
