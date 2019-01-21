const extend = require('extend');

const inexpress = function (options) {
    'use strict';
    if (!(this instanceof inexpress)) return new inexpress(options);


    options = extend(true, {
            http: null, //for cluster
            name: null,
            port: 8080,
            dirname: null,
            viewsFolder: './views',
            secure: {
                isHelmet: true,
                isHpp: true,
                //TODO: (Erez) decide what is the default maxContentLength.
                maxContentLength: 999 // set to 0 to accept any content length.
            },
            useSession: false,
            sessionSecret: null,
            sessionType: 'redis', //redis or mongo
            sessionConnection: null, //for mongo can be connection string or mongoose.connection, for redis should be a host and port
            sessionCookieName: 'connect.sid',
            middleWares: null,
            cookieParser: true,
            bodyParser: true,
            listen: true,
            onListen: null
        },
        options);

    var http;
    if (options.http) {
        http = options.http;
    } else {
        http = require('http');
    }


    var express = require('express');

    var app = express();
    app.set('views', options.viewsFolder);
    app.set('view engine', 'vash');

    //app.use(function (req, res, next) {
    //    console.log('first:', req.url);
    //    next();
    //});

    if (options.middleWares) {
        options.middleWares.forEach(function (mw) {
            app.use(mw);
        });
    }

    // Helmet helps securing Express apps by setting various HTTP headers.
    if (options.secure.isHelmet) {
        var helmet = require('helmet');
        app.use(helmet());
    }

    // hpp protect against HTTP Parameter Pollution attacks.
    if (options.secure.isHpp) {
        var hpp = require('hpp');
        app.use(hpp());
    }


    // Make sure our application is not vulnerable to large payload attacks.
    if (options.secure.maxContentLength !== 0) {
        var contentLength = require('express-content-length-validator');
        app.use(contentLength.validateMax({
            max: options.secure.maxContentLength,
            status: 400,
            message: 'Invalid payload!'
        }));
    }


    if (options.cookieParser) {
        var cookieParser = require('cookie-parser')();
        app.use(cookieParser);
    }


    if (options.useSession) {
        var session = require('express-session');
        //var MongoStore = require('connect-mongo')(session);
		// var sessionStore = new MongoStore({ mongooseConnection: options.sessionConnection });
		

        //var sessionStore = getSessionStore(session);

        //if (typeof options.sessionConnection === 'string') {
        //    var mongoose = require('mongoose');
        //    mongoose.connect(options.sessionConnection);
        //    sessionStore = new MongoStore({
        //        mongooseConnection: mongoose.connection,
        //        //ttl: 14 * 24 * 60 * 60 // = 14 days. Default
        //    });
        //} else {
        //    sessionStore = new MongoStore({
        //        mongooseConnection: options.sessionConnection,
        //        //ttl: 14 * 24 * 60 * 60 // = 14 days. Default
        //    });
        //}


        app.session = session({
            secret: options.sessionSecret,
            resave: false,
            saveUninitialized: true,
            name: options.sessionCookieName
        });
        app.use(app.session);

    }
    //app.use(function (req, res, next) {
    //    //console.log('req', req);
    //    req.on('data', function(chunk) {
    //        console.log("Received body data:");
    //        console.log(chunk.toString());
    //    });
    //
    //    next(req, res);
    //});

    //for the body request to get posted data like req.body.categoryName - see https://www.npmjs.com/package/body-parser
    if (options.bodyParser) {
        var bodyParser = require('body-parser');
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
    }

    //set the public static resource folder
    if (options.dirname) {
        app.use(express.static(options.dirname + '/public'));
    }

    var server = http.createServer(app);
    //var server = http.createServer(function (req,res) {
    //    console.log(req.url);
    //});



    if (options.listen) {
        server.listen(options.port, function () {
            console.log(options.name + ' Running on port ' + options.port);
            if (options.onListen) {
                options.onListen();
            }
        });
    }


    app.server = server;
    app.cookieParser = cookieParser;
    app.app = app;

    app.setStaticFolder = function (staticFolder) {
        app.use(express.static(staticFolder));
    };

    return app;


    function getSessionStore(session) {
        if (options.sessionType === 'redis') {
            var RedisStore = require('connect-redis')(session);
            if (!options.sessionConnection) { //default host and port
                return new RedisStore({host: 'localhost', port: 6379});
            } else {
                return new RedisStore({host: options.sessionConnection.host, port: options.sessionConnection.port});
            }
        } else { //mongo
            var MongoStore = require('connect-mongo')(session);
            var mongoStore;

            if (typeof options.sessionConnection === 'string') {
                var mongoose = require('mongoose');
                mongoose.connect(options.sessionConnection);
                mongoStore = new MongoStore({
                    mongooseConnection: mongoose.connection,
                    //ttl: 14 * 24 * 60 * 60 // = 14 days. Default
                });
            } else {
                mongoStore = new MongoStore({
                    mongooseConnection: options.sessionConnection,
                    //ttl: 14 * 24 * 60 * 60 // = 14 days. Default
                });
            }

            return mongoStore;
        }
    }

};

module.exports = inexpress;


//
//(function (mdl) {
//
//
//
//    mdl.initApp = function (options) {
//        options = extend(true, {
//            http: null, //for cluster
//            name: null,
//            port: 8080,
//            dirname: null,
//            useSession: false,
//            sessionSecret: null,
//            sessionConnection: null //can be connection string or mongoose.connection
//        }
//            , options);
//
//        var http;
//        if (options.http) {
//            http = options.http;
//        } else {
//            http = require('http');
//        }
//        var express = require('express');
//
//        var app = express();
//        app.set("view engine", "vash");
//
//        //set the public static resource folder
//        if (options.dirname)
//            app.use(express.static(options.dirname + "/public"));
//
//        var cookieParser = require('cookie-parser')();
//        app.use(cookieParser);
//
//        if (options.useSession) {
//            var session = require('express-session');
//            var MongoStore = require('connect-mongo')(session);
//            // var sessionStore = new MongoStore({ mongooseConnection: options.sessionConnection });
//            var sessionStore;
//
//            if (typeof options.sessionConnection === 'string') {
//                var mongoose = require('mongoose');
//                mongoose.connect(options.sessionConnection);
//                sessionStore = new MongoStore({
//                    mongooseConnection: mongoose.connection,
//                    //ttl: 14 * 24 * 60 * 60 // = 14 days. Default
//                });
//            } else {
//                sessionStore = new MongoStore({
//                    mongooseConnection: options.sessionConnection,
//                    //ttl: 14 * 24 * 60 * 60 // = 14 days. Default
//                });
//            }
//
//
//            mdl.session = session({
//                secret: options.sessionSecret,
//                resave: false,
//                saveUninitialized: true,
//                store: sessionStore
//            });
//            app.use(mdl.session);
//
//        }
//
//
//
//
//        //for the body request to get posted data like req.body.categoryName - see https://www.npmjs.com/package/body-parser
//        var bodyParser = require('body-parser');
//        app.use(bodyParser.urlencoded({ extended: true }));
//        app.use(bodyParser.json());
//
//        var server = http.createServer(app);
//        server.listen(options.port);
//        console.log(options.name + " Running on port " + options.port);
//
//        mdl.server = server;
//        mdl.cookieParser = cookieParser;
//        mdl.app = app;
//
//        return app;
//    };
//
//})(module.exports);
//
//
//
//
