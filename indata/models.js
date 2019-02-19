const Sequelize = require('sequelize');
let tables = {};


function init(sqz) {

    tables.system = sqz.define('system', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        dbVersion: Sequelize.STRING
    }, {
            freezeTableName: true,
            tableName: 'system'
        });


    tables.botChatLog = sqz.define('botChatLog', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false
        },
        message: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
            freezeTableName: true,
            tableName: 'botChatLog'
        });


    return tables;

};

module.exports = {
    tables: tables,
    init: init
};


