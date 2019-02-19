'use strict';
var expect = require('chai').expect;
const indata = require('../../indata/index.js');

describe('general db testings', function () {
    it('should connect', function (done) {
        indata.init(function (err) {
            expect(err).to.be.undefined;
            // console.log(indata.);
            done();
        });
    });

    it('should create log', function (done) {
        indata.logStore.addBotLog({
            username:'testUser',
            message:'someMsg'
        },function(err){
            expect(err).to.be.undefined;
            done();
        });
    });
});