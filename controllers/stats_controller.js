var Group = require('../models/group_model');

var StatsController = {

	/**
	 * @param {Array.<Document>} matches
	 * @param {Document} summoner
	 * @returns {Object}
	 */
	getSummonerStats : function(matches, summoner){
		var stats = summoner.toJSON;
		stats.games = stats.wins = stats.losses = 0;
		stats.kills = stats.deaths = stats.assists = 0;

		matches.forEach(function(match){
			var participant = match.participants.find({summonerId:summoner.id});
			stats.highestAchievedSeasonTier = stats.highestAchievedSeasonTier || participant.highestAchievedSeasonTier;
			stats.games++;
			stats.kills += participant.stats.kills;
			stats.deaths += participant.stats.deaths;
			stats.assists += participant.stats.assists;
			participant.stats.winner ? stats.wins++ : stats.losses++;
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
					summonerId : 0,
					games : 0, wins : 0, losses : 0,
					kills : 0, deaths : 0, assists : 0
				};

				var statsList = [combinedStats];

				group.summoners.forEach(function(summoner){
					var stats = StatsController.getSummonerStats(group.matches, summoner);
					statsList.push(stats);

					combinedStats.games = stats.games;
					combinedStats.wins = stats.wins;
					combinedStats.losses = stats.losses;
					combinedStats.kills += stats.kills;
					combinedStats.deaths += stats.deaths;
					combinedStats.assists += stats.assists;
				});

				return statsList;
			});

	}

};

module.exports = StatsController;