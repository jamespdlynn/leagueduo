require('../utils');

var GroupController = require('../controllers/group_controller');
var MatchController = require('../controllers/match_controller');
var StatsController = require('../controllers/stats_controller');

var names = config.test.summoner_names;
var region = config.test.region;
var group;

describe('Stats Controller', function(){

	before(function(){
		return GroupController.createGroup(names, region)
			.then(MatchController.updateGroupMatches)
			.then(function(value){
				group = value;
				return group.populate('matches');
			});
	});

	describe("getSummonerStats", function(){

		it("return summoner stats object with valid data", function(){
			var stats = StatsController.getSummonerStats(group.matches, group.summoners[0])
			expect(stats).toBeDefined();
			expect(stats.games).toBeGreaterThan(0);
			expect(stats.wins + stats.losses).toEqual(stats.games);
			expect(stats.kills).toBeGreaterThan(0);
			expect(stats.deaths).toBeGreaterThan(0);
			expect(stats.assists).toBeGreaterThan(0);
		});

		it("returns group stats array with valid data", function(){
			return StatsController.getGroupStats(group, group.summoners[0])

				.then(function(statsList){
					expect(statsList).toBeDefined();
					expect(statsList.length).toEqual(names.length+1);
					expect(statsList[0].games).toEqual(statsList[1].games);
					expect(statsList[0].kills).toBeGreaterThan(statsList[1].kills);
				});
		});
	});
});