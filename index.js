"use strict";
const config = require('./config/config.js');
const inexpress = require("./inexpress");
const indata = require('./indata/index.js');

indata.init(function(err){
    if(err){
        console.error('error initializing data ',err)
    }else{


        let app = new inexpress({
            name: 'yoasimBot.web',
            port: config.port,
            dirname: __dirname,
            useSession: true,
            sessionSecret: 'yoasimBot.web.SecretSecret123',
            secure: {
                isHelmet: false,
                isHpp: true,
                maxContentLength: 999 // set to 0 to accept any content length.
            },
            listen: config.webListen
        });
        
        let controllers = require('./controllers');
        controllers.init(app);
        
        const telegramBot = require('./telegramBot/index.js');
    }
});
