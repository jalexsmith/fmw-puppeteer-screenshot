const { parse } = require('url');
const { getScreenshot } = require('./chromium');
const { getInt, getUrlFromPath, isValidUrl } = require('./validator');

module.exports = async function (req, res) {
    try {
        const browser = await puppeteer.launch()
		const page = await browser.newPage()
		await page.tracing.start({
		    path: 'trace.json',
		    categories: ['devtools.timeline']
		})
		await page.goto('https://www.indeed.com/salaries/Warehouse-Supervisor-Salaries,-San%20Francisco-CA')
		
		// execute standard javascript in the context of the page.
		const stories = await page.evaluate(() => {
		    const raw_results = Array.from(document.querySelectorAll('div.cmp-sal-salary'))
		    var salaries = 0;
		    var wages = 0;
		    for (var i=0; i < raw_results.length; i++) {
		        if(raw_results[i].textContent.indexOf('per year') !== -1) {
		            salaries = salaries + parseFloat(raw_results[i].textContent.replace('per year', '').replace('$', '').replace(',', ''));
		        } else if (raw_results[i].textContent.indexOf('per hour') !== -1) {
		            wages = wages + parseFloat(raw_results[i].textContent.replace('per hour', '').replace('$', '').replace(',', ''));
		        }				
		    }
		    salaries = salaries + ((wages*40)*50);
		    return Math.round(salaries/raw_results.length);
		})
		console.log(stories)
		await page.tracing.stop();
		await browser.close()
    } catch (e) {
        console.error(e.message);
        res.setHeader('Content-Type', 'text/html');
        res.status(500).send('<h1>Unexpected Error</h1><p>Sorry, there was a problem</p>');
    }
};



const puppeteer = require('puppeteer');


