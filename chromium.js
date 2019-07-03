const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

async function getIndeedSalary(url) {
    const browser = await puppeteer.launch({
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: chrome.headless,
    });
    
    const page = await browser.newPage();
    
    //await page.goto('https://www.indeed.com/salaries/Warehouse-Supervisor-Salaries,-San%20Francisco-CA')
	await page.goto(url)
	// execute standard javascript in the context of the page.
	const stories = await page.evaluate(() => {
		if(document.querySelectorAll('div.cmp-not-enough-data-box').length >= 1) {
			var salaries = document.querySelectorAll('div.cmp-not-enough-data-box strong')[0].textContent.replace('$', '').replace(',', '');
		    return Math.round(salaries);
		} else {
			const raw_results = Array.from(document.querySelectorAll('div.cmp-sal-salary'));
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
		}	    
	})
    
    await browser.close();
    return stories;
}

module.exports = { getIndeedSalary };