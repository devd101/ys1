const extend = require('extend');

let conf = {
	projectName: 'YoasimBot',
	port: 30001
};

if (process.argv.length > 2 && process.argv[2] == 'dev') {

	conf = extend(true, conf, {
		projectName: 'YoasimBot-Dev',
		port: 20001
	});
}


module.exports = conf;