var Promise = require('bluebird');
var Match = require('../models/match');
var request = require('request-promise');

var MatchController = {

	fetchMatch : function(matchId){
		return Match.findBydId(matchId).exec();
	},

	createMatch : function(matchId, summoners, region){

		//convert summoners to id array if necessary
		if (summoners.length && typeof(summoners[0]) === 'object'){
			summoners = summoners.map(function(summoner){
				return summoner.id;
			});
		}

		var uri = config.riot.api_root.replace(/region/g, region) +
		'/v2.2/match/'+matchId +
		'?api_key=' + config.riot.api_key;

		return request({uri: uri, transform: JSON.parse}).then(function(res) {

			//filter participants array
			var filteredParticipants = [];
			res.participantIdentities.forEach(function(identity) {
				//if this participant is included in the summoners argument, then copy over the identity data and save
				if (~summoners.indexOf(identity.player.summonerId)){
					var participant = res.participants.find({participantId: identity.participantId});
					participant.summonerId = identity.player.summonerId;
					participant.matchHistoryUri = identity.player.matchHistoryUri;
					filteredParticipants.push(participant);
				};
			});

			if (filteredParticipants.length < summoners.length){
				throw {statusCode:400, message:"Match did not contain all the summoner identifiers passed to function"};
			}

			res.participants = filteredParticipants;

			var match = new Match(res);

			//no need to wait to see if save is successful
			match.save(function(err){
				if (err) console.error(err);
			});

			return match;
		});
	},

	removeMatch : function(matchId){
		return Match.findByIdAndRemove(matchId).exec();
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
			'/v2.2/matchlist/by-summoner/' + summonerId
			'?beginTime=' + beginTime || 0 +
			'&api_key=' + config.riot.api_key;

		return request({uri: uri, transform: JSON.parse}).then(function(res){
			return res.matches.map(function(match){
				return match.id;
			});
		});
	}

};

module.exports = MatchController;