const Sequelize = require('sequelize');
const models = require('./models.js');
let me = {};

function init(done) {
    let sequelize = new Sequelize('yoasimBot', null, null, {
        dialect: "sqlite",
        // storage: ":memory",
        storage: __dirname + '/dbfile/ys.sqlite',
        operatorsAliases: false
    });

    models.init(sequelize);

    sequelize.sync({ force: false })
        .then(() => {
            console.log('Database & tables created!')
            done();
        }).catch((err) => {
            console.log('error connection to the databse', err);
            done(err);
        });


}

module.exports = {
    init: init,
    // tables: models.tables
    logStore: require('./logStore.js')
};




