require('../utils');

var express = require('express')
var bodyParser = require('body-parser');
var router = require('../controllers/router');
var request = require('request-promise');

var app = express()
app.use(bodyParser.json());
router(app);

var port = config.test.server_port;
var names = config.test.summoner_names;
var region = config.test.region;
var invalidId = config.test.invalid_id+'';
var rootURL = 'http://localhost:'+port;

describe('API Test', function(){

	//begin listening on test port
	before(function(done){
		app.listen(port, done);
	});

	describe("POST /", function(){

		var options = {
			uri:rootURL+'/',
			method:'POST',
			json : true
		};

		it("returns valid group statistics data", function(){

			options.body = {
				summoners : names,
				region : region
			};

			return request(options).then(function(res){
				expect(res).toBeDefined();
				expect(res.stats).toBeDefined();
				expect(res.stats.length).toEqual(names.length+1);
			});

		});

		it("returns 400 status error on invalid region", function(){
			options.body = {
				summoners : names,
				region : invalidId
			};

			return request(options).catch(function(err){
				expect(err).toBeDefined();
				expect(err.statusCode).toBe(400);
			});
		});

		it("returns 400 status error on missing summoner name", function(){
			options.body = {
				region : region
			};

			return request(options).catch(function(err){
				expect(err).toBeDefined();
				expect(err.statusCode).toBe(400);
			});
		});

		it("returns 404 status error on invalid summoner name", function(){

			options.body = {
				summoners : [invalidId],
				region : region
			};

			return request(options).catch(function(err){
				expect(err).toBeDefined();
				expect(err.statusCode).toBe(404);
			});
		});
	});


});