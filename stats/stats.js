"use strict";
const config = require('../config/config.js');

(function (mdl) {
    mdl.botCallStats = {
        projectName: config.projectName,
        users: {}
    };


    mdl.addBotCall = function (ctx) {
        let userStat = mdl.botCallStats.users[ctx.from.username] || {
            numberOfCalls: 0
        };

        userStat.numberOfCalls++;
        userStat.lastCall = new Date();
        mdl.botCallStats.users[ctx.from.username] = userStat;

        console.log(mdl.botCallStats);

    };

})(module.exports);