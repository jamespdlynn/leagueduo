require('../utils');

var GroupController = require('../controllers/group_controller');
var MatchController = require('../controllers/match_controller');
var StatsController = require('../controllers/stats_controller');

var names = config.test.summoner_names;
var region = config.test.region;
var group;

describe('Stats Controller', function(){

	this.timeout(10000);

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
			return group.populate('matches').execPopulate().then(function(){
				var stats = StatsController.getSummonerStats(group.matches, group.summoners[0]);
				expect(stats).toBeDefined();
				expect(stats.summoner.id).toEqual(group.summoners[0].id);
				expect(stats.games).toBeGreaterThan(0);
				expect(stats.wins + stats.losses).toEqual(stats.games);
				expect(stats.kills).toBeGreaterThan(0);
				expect(stats.deaths).toBeGreaterThan(0);
				expect(stats.assists).toBeGreaterThan(0);
			});
		});
	});

	describe("getGroupStats", function(){

		it("returns group stats array with valid data", function(){
			return StatsController.getGroupStats(group)

				.then(function(statsWrapper){
					expect(statsWrapper).toBeDefined();
					expect(Object.keys(statsWrapper).length).toEqual(names.length+1);
					expect(statsWrapper.combined).toBeDefined();
					expect(statsWrapper.combined.games).toBeGreaterThan(0);

					names.forEach(function(name){
						var key = name.toKey();
						expect(statsWrapper[key]).toBeDefined();
						expect(statsWrapper[key].summoner).toBeDefined();
						expect(statsWrapper[key].games).toEqual(statsWrapper.combined.games);
					});
				});
		});


	});


});