var GroupController = require('./group_controller');
var MatchController = require('./match_controller');
var StatsController = require('./stats_controller');
var Group = require('../models/group_model');

module.exports = function(app) {

	app.post('/', function(req, res, next){

		var data = req.body;

		//post data validation
		if (!data.summoners || !data.summoners.length || data.summoners.length > 5 || !data.summoners[0] || typeof data.summoners[0] !== 'string'){
			return res.status(400).send('must include "summoners" array containing 1-5 summoner names');
		}

		data.region = data.region || config.riot.default_region;
		if (!Group.isValidRegion(data.region)){
			return res.status(400).send('invalid region: '+data.region);
		}

		GroupController.createGroup(data.summoners, data.region)

			.then(MatchController.updateGroupMatches)

			.then(StatsController.getGroupStats)

			.then(function(statsList){
				data.stats = statsList;
				res.send(data);
			})

			.catch(function(err){
				if (err.statusCode && err.statusCode < 500){
					return res.status(err.statusCode).send(err.message);
				}
				next(err);
			});

	});

};