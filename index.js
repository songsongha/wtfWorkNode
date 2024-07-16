const rp = require('request-promise');
const cheerio = require('cheerio');
const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE, (err)=>{
    if (err) return console.error(err.message)
        console.log('connection successful')
})

// // Create table
// db.run(
//     'CREATE TABLE jobs(url, job_title, wage_hour, wage_year, requirements, num_postings)'
// )

const insertSQL = 'INSERT INTO jobs (url, job_title, wage_hour, wage_year, requirements, num_postings) VALUES (?,?,?,?,?,?)'

for (let i = 2012; i < 2017; i++){
    const url = `https://www.jobbank.gc.ca/marketreport/summary-occupation/${i}/ca`;

    rp(url)
        .then(html => {
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
        
        const numPosting = Number($('#j_id_2n_2_44 .section-value').text().trim().replace(/[$,/a-z ]/g,''));
        console.log({url})
        console.log({jobTitle})
        console.log({requirements})
        console.log({wageString})
        console.log({numPosting})

        if (jobTitle) db.run(insertSQL, [url, jobTitle, wageHour, wageYear, requirements, numPosting])
    
        })
        .catch((err) => {
        console.log({err})
        //handle error
        });

}



//   const viewSQL= 'SELECT * FROM jobs'

//   db.all(viewSQL,[], (err, rows)=>{
//     if (err) console.error(err.message)
//     rows.forEach((row)=>{
//         console.log(row)
//     })
// })
// db.close((err) => {
//     if (err) return console.error(err.message)
//         console.log('db close successful')
// })