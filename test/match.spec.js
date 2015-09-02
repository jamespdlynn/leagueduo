require('../utils');

var MatchController = require('../controllers/match');

var region = config.test.region;
var summonerId = config.test.summoner_names;
var matchId = config.test.match_id;
var invalidId = config.test.invalid_id;

describe('Match Controller', function(){

	describe("createMatch", function(){
		before(function(){
			return MatchController.removeMatch(matchId);
		});

		it("returns valid match", function(){
			return MatchController.createMatch(matchId, [summonerId], region)
				.then(function(match){

					expect(match).toBeDefined();
					expect(match.matchId).toBeDefined();
					expect(match.matchCreation).toBeDefined();
					expect(match.participants).toBeDefined();
					expect(match.participants.length).toEqual(1);
					expect(match.participants[0].stats).toBeDefined();
					expect(match.participants[0].timeline).toBeDefined();
				});
		});


		it("returns 404 status error", function(){
			return MatchController.createMatch(invalidId, region)
				.catch(function(err){
					expect(err).toBeDefined();
					expect(err.statusCode).toEqual(404);
				});
		});

		it("returns 400 status error", function(){
			return MatchController.createMatch(matchId, [invalidId], region)
				.catch(function(err){
					expect(err).toBeDefined();
					expect(err.statusCode).toEqual(400);
				});
		});
	}),

	describe("fetchMatch", function(){

		//wait half a second to ensure prior match has been saved to db
		before(function(done){
			setTimeout(done, 500);
		});

		it("returns match model from database", function(){
			return MatchController.fetchMatch(matchId).then(function(value){
				expect(value).toBeDefined();
				expect(value.id).toEqual(match.id);
			});
		});

		after(function(){
			return MatchController.removeMatch(matchId);
		});
	});


	describe("retrieveSummonerMatchData", function(){

		it("returns valid match data list", function(){
			MatchController.retrieveSummonerMatchIds(summonerId, region)
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





});