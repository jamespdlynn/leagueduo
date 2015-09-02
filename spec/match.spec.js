require('../utils');

var GroupController = require('../controllers/group');
var MatchController = require('../controllers/match');

var region = config.test.region;
var summonerNames = config.test.summoner_names;
var summonerId = config.test.summoner_id;
var matchId = config.test.match_id;
var invalidId = config.test.invalid_id;

describe('Match Controller', function(){

	var match;

	describe("createMatch", function(){
		before(function(){
			return MatchController.removeMatch(matchId);
		});

		it("returns valid match", function(){
			return MatchController.createMatch(matchId, region)
				.then(function(value){

					match = value;
					expect(match).toBeDefined();
					expect(match.matchId).toBeDefined();
					expect(match.matchCreation).toBeDefined();
				});
		});

		it("match has valid participant data", function(){
			expect(match).toBeDefined();
			expect(match.participants).toBeDefined();
			expect(match.participants.length).toEqual(10);

			var participant = match.participants.find({summonerId:summonerId});
			expect(participant).toBeTruthy();
			expect(participant.stats).toBeDefined();
			expect(participant.timeline).toBeDefined();
		});



		it("returns 404 status error", function(){
			return MatchController.createMatch(invalidId, region)
				.catch(function(err){
					expect(err).toBeDefined();
					expect(err.statusCode).toEqual(404);
				});
		});
	}),

	describe("fetchMatch", function(){

		it("returns match model from database", function(){
			return MatchController.fetchMatch(matchId).then(function(value){
				expect(value).toBeTruthy();
				expect(value.matchId).toBeDefined();
			});
		});

		after(function(){
			return MatchController.removeMatch(matchId);
		});
	});


	describe("retrieveSummonerMatchData", function(){

		it("returns valid match data list", function(){
			return MatchController.retrieveSummonerMatchIds(summonerId, region)
				.then(function(matchIds){
					expect(matchIds).toBeDefined();
					expect(matchIds.length).toBeGreaterThan(0);
					expect(typeof matchIds[0]).toBe('number');
				});
		});

		it("returns 404 status error", function(){
			return MatchController.retrieveSummonerMatchIds(invalidId, region)
				.catch(function(err){
					expect(err).toBeDefined();
					expect(err.statusCode).toEqual(404);
				});
		});


	});

	describe("updateGroupMatches", function(){

		var group;

		before(function(){
			return GroupController.fetchGroup(summonerNames, region).then(function(value){
				group = value;
				group.matches = [];
			});
		});

		it("most recent match should be null", function(){
			return group.getMostRecentMatch()
				.then(function(value){
					expect(value).toBe(null);
				});
		});

		it("group should be appended with new matches", function(){
			return MatchController.updateGroupMatches(group)
				.then(function(){
					expect(group.matches.length).toBeGreaterThan(0);
				});
		});

		it("most recent match should not be null", function(){
			return group.getMostRecentMatch()
				.then(function(value){
					expect(value).toBeTruthy();
				});
		});

		it("group should be not be appended with any new matches", function(){
			var matchLength = group.matches.length;
			return MatchController.updateGroupMatches(group)
				.then(function(){
					expect(group.matches.length).toEqual(matchLength);
				});
		});

	});





});