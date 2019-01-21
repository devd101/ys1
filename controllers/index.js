"use strict";
(function (mdl) {
    const statsController=require('./statsController.js');
	mdl.init = function (app) {
		app.get('/ping', (req, res) => {
			res.status(200).send({ result: 'pong' });
		})

        statsController.init(app);

    };
    
})(module.exports)