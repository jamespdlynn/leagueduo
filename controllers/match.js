var Promise = require('bluebird');
var Match = require('../models/match');
var request = require('request-promise');

var MatchController = {

	fetchMatch : function(matchId, region){
		return Match.findById(matchId).exec().then(function(match){
			//returns either cached group or another promise which returns a new group in turn
			return match ? match : MatchController.createMatch(matchId, region);
		});
	},

	createMatch : function(matchId, region){

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

			return new Match(res).save();
		});
	},

	removeMatch : function(matchId){
		return Match.findByIdAndRemove(matchId).exec();
	},

	updateGroupMatches : function(group){
		return group.getMostRecentMatch()

			.then(function(match){
				var beginTime = match ? match.matchCreation+1 : 0;
				var promises = [];
				group.summoners.forEach(function(summoner){
					var promise = MatchController.retrieveSummonerMatchIds(summoner.id, group.region, beginTime);
					promises.push(promise);
				})
				return Promise.all(promises);
			})

			.then(function(matchIdsList){

				var sharedMatchIds = matchIdsList[0];
				for (var i=1; i < matchIdsList.length; i++){
					sharedMatchIds = sharedMatchIds.intersect(matchIdsList[i]);
				}

				if (!sharedMatchIds.length){
					return Promise.resolve([]);
				}

				var promises = [];
				sharedMatchIds.forEach(function(matchId){
					var promise = MatchController.fetchMatch(matchId, group.region);
					promises.push(promise);
				})

				return Promise.all(promises);
			})

			.then(function(matches){
				group.matches = group.matches.concat(matches);
				return group.update();
			});
	},

	/**
	 * Retrieve array of match identifiers for this summoner
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
			return res.matches.map(function(match){
				return match.matchId;
			});
		});

	},

};

module.exports = MatchController;