const { parse } = require('url');
const { getIndeedSalary } = require('./chromium');
const { getUrlFromPath } = require('./validator');

module.exports = async function (req, res) {
    try {
        const { pathname = '/' } = parse(req.url);
        const url = getUrlFromPath(pathname);
        if (!isValidUrl(url)) {
            res.setHeader('Content-Type', 'text/html');
            res.status(400).send(`<h1>Bad Request</h1><p>The url <em>${url}</em> is not valid.</p>`);
        } else {
            const stories = await getIndeedSalary(url, type, qual, fullPage);
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(stories);
        }
    } catch (e) {
        console.error(e.message);
        res.setHeader('Content-Type', 'text/html');
        res.status(500).send('<h1>Unexpected Error</h1><p>Sorry, there was a problem</p>');
    }
};