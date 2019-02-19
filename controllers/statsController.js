"use strict";
const stats = require('../stats/stats.js');
const indata = require('../indata/index.js');
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
        });

        app.get('/stats/botLog', (req, res) => {
            indata.logStore.getBotLog(function (logs, err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    let converter = require('json-2-csv');
                    converter.json2csv(logs, function (err, csv) {
                        console.log('csv', csv);
                        if (err) {
                            res.status(500).send('error creating csv:' + err);
                        } else {
                            res.set({ "Content-Disposition": 'attachment; filename="botlog.csv"' });
                            res.send(csv);
                        }
                    }, {
                            keys: [
                                'username',
                                'message',
                                'createdAt'
                            ]
                        });
                }
            });
        });

    }


})(module.exports)