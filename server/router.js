var util = require('util');

var GroupController = require('./controllers/group_controller');
var MatchController = require('./controllers/match_controller');
var StatsController = require('./controllers/stats_controller');
var Group = require('./models/group_model');

module.exports = function(app) {

	//default post handler
	app.get('/stats', function(req, res, next){

		var summoners = req.query.summoners || [];
		var region = (String(req.query.region || config.riot.default_region)).toLowerCase() ;

		if (typeof summoners === 'string'){
			summoners = summoners.split(',');
		}

		//data validation
		if (!util.isArray(summoners) || !summoners.length || summoners.length > 5){
			return res.status(400).send('must include "summoners" array containing 1-5 summoner names');
		}

		if (!Group.isValidRegion(region)){
			return res.status(400).send('invalid region: '+region);
		}

		//let's get to it, go go promise chaining!
		GroupController.createGroup(summoners, region)

			.then(MatchController.updateGroupMatches)

			.then(StatsController.getGroupStats)

			.then(function(statsWrapper){
				res.send({
					summoners : summoners.map(function(name){
						return name.toKey()
					}),
					region : region,
					stats : statsWrapper
				});
			})

			.catch(function(err){
				//catch and return any non critical errors
				if (err.statusCode && err.statusCode < 500){
					return res.status(err.statusCode).send(err.message);
				}
				next(err);
			});

	});

	//fetch match by id handler
	app.get('/match/:id', function(req, res, next){
		//TODO implement call
		res.status(503).send('not yet implemented');
	});

	//create match handler
	app.post('/match', function(req, res, next){
		//TODO implement call
		res.status(503).send('not yet implemented');
	});

	//update match handler
	app.put('/match', function(req, res, next){
		//TODO implement call
		res.status(503).send('not yet implemented');
	});

};