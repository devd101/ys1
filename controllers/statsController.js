"use strict";
const stats = require('../stats/stats.js');

(function (mdl) {

    let testData = {
        users: {
            user1: {
                numberOfCalls: 10,
                lastCall: '2012-04-23T18:25:43.511Z'
            },
            user2: {
                numberOfCalls: 10,
                lastCall: '2012-04-23T18:25:43.511Z'
            }
        }
    };

    mdl.init = (app) => {
        app.get('/stats/data', (req, res) => {
            res.status(200).send(stats.botCallStats);
            // res.status(200).send({
            //     solution: '1.0',
            //     intakeWeb: '1.0',
            //     db: "1.0"
            // });
        })
    }
})(module.exports)