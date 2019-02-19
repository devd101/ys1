const models = require('./models.js');

module.exports = {
    addBotLog: function (log, next) {
        models.tables.botChatLog.create({
            username: log.username,
            message: log.message
        }).then(function () {
            next();
        }).catch(function (err) {
            next(err);
        });
    },
    getBotLog: function (next) {
        models.tables.botChatLog.findAll(
            
        ).then(botLogs => {
            next(botLogs);
        }).catch(err => {
            next(null, err);
        });
    }
};