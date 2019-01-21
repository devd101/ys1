"use strict";
const config = require('./config/config.js');
const inexpress = require("./inexpress");

let app = new inexpress({
    name: 'yoasimBot.web',
    port: config.port,
    dirname: __dirname,
    useSession: true,
    sessionSecret: 'yoasimBot.web.SecretSecret123',
    secure: {
        isHelmet: false,
        isHpp: true,
        maxContentLength : 999 // set to 0 to accept any content length.
    }
});

let controllers = require('./controllers');
controllers.init(app);

const telegramBot=require('./telegramBot/index.js');