var Promise = require('bluebird');
var Group = require('../models/group');
var request = require('request-promise');

var GroupController = {

	/**
	 * Retrieves a group model that either already exists in the database or creates and returns a new one
	 * @param {string} summonerNames
	 * @param {string} region
	 * @return {Promise.<Group,Error>}
	 */
	 fetchGroup : function (summonerNames, region){
		return Group.findBySummoners(summonerNames, region).then(function(group){
			//returns either cached group or another promise which returns a new group in turn
			return group ? group : GroupController.createGroup(summonerNames, region);
		});
	},


	/**
	 * Retrieves basic summoner data information through API call and uses it to generate and save a new group model
	 * @param {string} summonerNames
	 * @param {string} region
	 * @return {Promise.<Group,Error>}
	 */
	createGroup : function(summonerNames, region) {
		var uri = config.riot.api_root.replace(/region/g, region) +
			'/v1.4/summoner/by-name/' + summonerNames.join(',') +
			'?api_key=' + config.riot.api_key;

		return request({uri: uri, transform: JSON.parse})

			.then(function (res) {
				//parse out the returned json object into an array of summoners
				var summoners = [];
				Object.keys(res).forEach(function (key) {
					summoners.push(res[key]);
				});

				if (summoners.length >= summonerNames.length) {
					//create new group model with data
					return new Group({
						summoners: summoners,
						region: region
					}).save();
				}
				else{
					//if all summoners requested are not in the array, then throw an error instead
					throw {statusCode: 404, message: 'Invalid summoner name'};
				}


			});
	},

	/**
	 * Removes group model from database cache
	 * @param {string} summonerNames
	 * @param {string} region
	 * @return {Promise.<Group,Error>}
	 */
	removeGroup : function(names, region){
		return Group.removeBySummoners(names, region);
	}

};

module.exports = GroupController;