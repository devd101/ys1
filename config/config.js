const extend = require('extend');

let webListen = true;

if (process.env.weblisten && process.env.weblisten == 'false') {
	webListen = false;
}

let conf = {
	projectName: 'YoasimBot',
	port: process.env.port || 30001,
	webListen: webListen
};

if (process.argv.length > 2 && process.argv[2] == 'dev') {

	conf = extend(true, conf, {
		projectName: 'YoasimBot-Dev',
		port: 20001
	});
}


module.exports = conf;