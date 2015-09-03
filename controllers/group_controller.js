var Promise = require('bluebird');
var Group = require('../models/group_model');
var request = require('request-promise');

var GroupController = {

	/**
	 * @param {string} summonerNames
	 * @param {string} region
	 * @return {Promise.<Group,Error>}
	 */
	fetchGroup : function (summonerNames, region){
		var id = Group.toId(summonerNames, region);
		return Group.findById(id).exec();
	},


	/**
	 * Generates, saves and returns new group model through data received through remote API
	 * @param {string} summonerNames
	 * @param {string} region
	 * @return {Promise.<Group,Error>}
	 */
	createGroup : function(summonerNames, region) {

		//Check if group exists in database first
		return this.fetchGroup(summonerNames, region).then(function(group){

			if (group){
				return group;
			}

			//Query for summoner data through api call
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
						//create new group model with returned data and save it to the database
						return new Group({
							summoners: summoners,
							region: region
						}).save();
					}
					else{
						//if all summoners requested are not in the returned array, then throw a 404 instead
						throw {statusCode: 404, message: 'one or more summoner names could not be found'};
					}
				});
		});

	},

	/**
	 * @param {string} summonerNames
	 * @param {string} region
	 * @return {Promise.<Group,Error>}
	 */
	removeGroup : function(summonerNames, region){
		var id = Group.toId(summonerNames, region);
		return Group.findByIdAndRemove(id).exec();
	}

};

module.exports = GroupController;