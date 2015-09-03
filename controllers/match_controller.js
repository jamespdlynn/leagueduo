var Promise = require('bluebird');
var Match = require('../models/match_model');
var request = require('request-promise');

var MatchController = {

	/**
	 * @param {number} matchId
	 * @returns {Promise.<Match,Error>}
	 */
	fetchMatch : function(matchId){
		return Match.findById(matchId).exec();
	},

	/**
	 * Generates, saves and returns new match model through data received through remote API
	 * @param {number} matchId
	 * @param {string} region
	 * @returns {Promise.<Match,Error>}
	 */
	createMatch : function(matchId, region){

		//Check if match already exists in database first
		return this.fetchMatch(matchId, region).then(function(match){

			if (match){
				return match;
			}

			//Query for match data
			var uri = config.riot.api_root.replace(/region/g, region) +
				'/v2.2/match/'+matchId +
				'?api_key=' + config.riot.api_key;

			return request({uri: uri, transform: JSON.parse}).then(function(res) {

				//copy participant identity data to identity array
				res.participantIdentities.forEach(function(identity) {
					var participant = res.participants.find({participantId: identity.participantId});
					participant.summonerId = identity.player.summonerId;
					participant.matchHistoryUri = identity.player.matchHistoryUri;
				});

				match = new Match(res);

				return match.save();
			});
		})


	},

	/**
	 * @param {number} matchId
	 * @returns {Promise.<Match,Error>}
	 */
	removeMatch : function(matchId){
		return Match.findByIdAndRemove(matchId).exec();
	},

	/**
	 * Remotely queries for any new matches that all summoners inside the group partook in, then updates the group with the new data
	 * @param {Group} group
	 * @returns {Promise.<Group,Error>}
	 */
	updateGroupMatches : function(group){

		//Get the most recent match creation time to determine where to begin search for matches from
		return group.getMostRecentMatchTime()

			.then(function(beginTime){
				var promises = [];
				//Get a list of all recent match ids for every summoner in the group
				group.summoners.forEach(function(summoner){
					var promise = MatchController.retrieveSummonerMatchIds(summoner.id, group.region, ++beginTime);
					promises.push(promise);
				})
				return Promise.all(promises);
			})

			.then(function(matchIdsList){

				//Narrow down the lists of matches into one containing only matches shared by all summoners in the group
				var sharedMatchIds = matchIdsList[0];
				for (var i=1; i < matchIdsList.length; i++){
					sharedMatchIds = sharedMatchIds.intersect(matchIdsList[i]);
				}

				if (!sharedMatchIds.length){
					return Promise.resolve([]);
				}

				//Fetch and save off full match data for each of these new matches
				var promises = [];
				sharedMatchIds.forEach(function(matchId){
					var promise = MatchController.createMatch(matchId, group.region);
					promises.push(promise);
				})

				return Promise.all(promises);
			})

			.then(function(matches){
				//Finally update the group with the newly obtained match models
			    group.matches.prepend(matches);
				return group.update().then(function(){
					return group;
				});
			});
	},

	/**
	 * Retrieve array of match identifiers for a given summoner
	 * @param {Number} summonerId
	 * @param {String} region
	 * @param {Number} [beginTime=0]
	 * @returns {Promise.<[Number],Error}
	 */
	retrieveSummonerMatchIds: function(summonerId, region, beginTime){

		var uri = config.riot.api_root.replace(/region/g, region) +
			'/v2.2/matchlist/by-summoner/' + summonerId +
			'?beginTime=' + (beginTime || 0) +
			'&api_key=' + config.riot.api_key;

		return request({uri: uri, transform: JSON.parse}).then(function(res){
			return res.matches ? res.matches.map(function(match){
				return match.matchId;
			}) : [];
		});

	},

};

module.exports = MatchController;