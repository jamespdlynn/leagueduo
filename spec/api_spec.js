require('../server/utils');

var express = require('express');
var request = require('request-promise');
var router = require('../server/router');

var app = express()
router(app);

var port = config.test.server_port;
var names = config.test.summoner_names;
var region = config.test.region;
var invalidId = config.test.invalid_id+'';
var rootURL = 'http://localhost:'+port;

describe('API', function(){

	this.timeout(100000);

	//begin listening on test port
	before(function(done){
		app.listen(port, done);
	});

	describe("GET /stats", function(){

		it("returns valid group statistics data", function(){

			var uri = rootURL + '/stats' +
				'?summoners=' + encodeURIComponent(names) +
				'&region=' + region;

			return request({uri:uri, json:true}).then(function(res){
				expect(res).toBeDefined();
				expect(res.stats).toBeDefined();
				expect(res.stats.combined).toBeDefined();
			});

		});

		it("returns 400 status error on missing summoner name", function(){
			var uri = rootURL + '/stats' +
				'?region=' + invalidId;

			return request({uri:uri, json:true}).catch(function(err){
				expect(err).toBeDefined();
				expect(err.statusCode).toBe(400);
			});
		});

		it("returns 400 status error on invalid region", function(){

			var uri = rootURL + '/stats' +
				'?summoners=' + names.join(',') +
				'&region=' + invalidId;

			return request({uri:uri, json:true}).catch(function(err){
				expect(err).toBeDefined();
				expect(err.statusCode).toBe(400);
			});
		});

		it("returns 404 status error on invalid summoner name", function(){

			var uri = rootURL + '/stats' +
				'?summoners=' + invalidId +
				'&region=' + region;

			return request({uri:uri, json:true}).catch(function(err){
				expect(err).toBeDefined();
				expect(err.statusCode).toBe(404);
			});
		});
	});


});