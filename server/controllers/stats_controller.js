var Group = require('../models/group_model');

var StatsController = {

	/**
	 * @param {Array.<Document>} matches
	 * @param {Document} summoner
	 * @returns {Object}
	 */
	getSummonerStats : function(matches, summoner){
		var stats = {
			summoner : summoner.toJSON({})
		};

		stats.games = stats.wins = stats.losses  =
		stats.kills = stats.deaths = stats.assists = 0;

		matches.forEach(function(match){
			var participant = match.participants.find({summonerId:summoner.id});

			if (participant){
				stats.summoner.tier = stats.summoner.tier || participant.highestAchievedSeasonTier;
				stats.games++;
				stats.kills += participant.stats.kills;
				stats.deaths += participant.stats.deaths;
				stats.assists += participant.stats.assists;
				participant.stats.winner ? stats.wins++ : stats.losses++;

				//TODO grab stats filtered by each champion and role played with
			}

		});

		return stats;
	},

	/**
	 * @param {Group] group
	 * @returns {Promise.<[Object],Error>}
	 */
	getGroupStats : function(group){

		return group.populate('matches').execPopulate()

			.then(function(){

				var combinedStats = {
					summoner : {id:0, name:'combined'},
					games : 0, wins : 0, losses : 0,
					kills : 0, deaths : 0, assists : 0
				};

				var statsWrapper = {
					combined : combinedStats
				};

				group.summoners.forEach(function(summoner){
					var stats = StatsController.getSummonerStats(group.matches, summoner);
					combinedStats.games = stats.games;
					combinedStats.wins = stats.wins;
					combinedStats.losses = stats.losses;
					combinedStats.kills += stats.kills;
					combinedStats.deaths += stats.deaths;
					combinedStats.assists += stats.assists;

					statsWrapper[summoner.name.toKey()] = stats;
				});

				return statsWrapper;
			});

	}

};

module.exports = StatsController;