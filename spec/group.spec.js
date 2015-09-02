require('../utils');

var GroupController = require('../controllers/group');

var names = config.test.summoner_names;
var region = config.test.region;
var invalidId = config.test.invalid_id;
var group;

describe('Group Controller', function(){

	describe("create", function(){

		//remove test group if already exists
		before(function(){
			return GroupController.removeGroup(names, region);
		});

		it("returns valid group model from remote data", function(){
			return GroupController.createGroup(names, region)
				.then(function(value){
					group = value;

					expect(group).toBeDefined();
					expect(group.region).toEqual(region);
					expect(group.summoners.length).toEqual(names.length);
					expect(group.summoners[0].id).toBeDefined();
					expect(group.summoners[0].name).toBeDefined();
				});
		});


		it("returns 404 status error", function(){
			return GroupController.createGroup([invalidId], region)
				.catch(function(err){
					expect(err).toBeDefined();
					expect(err.statusCode).toEqual(404);
				});
		});
	}),

	describe("fetch", function(){

		it("returns group model from database", function(){
			return GroupController.fetchGroup(names, region).then(function(value){
				expect(value).toBeDefined();
				expect(value.id).toEqual(group.id);
			});
		});


		it("returns 404 status error", function(){
			return GroupController.fetchGroup(names.concat(invalidId), region)
				.catch(function(err){
					expect(err).toBeDefined();
					expect(err.statusCode).toEqual(404);
				});
		});


	})

});