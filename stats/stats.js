"use strict";
const config = require('../config/config.js');
const indata = require('../indata/index.js');

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

        var logMsg;;
        if (ctx.updateType == "callback_query") {
            logMsg = ctx.callbackQuery.data;
        }else{
            logMsg = ctx.message.text
        }
        indata.logStore.addBotLog({
            username: ctx.from.username,
            message: logMsg
        }, function (err) {
            //do nothing...
            if (err) {
                console.error('error adding log:', err);
            }
        });

    };

})(module.exports);