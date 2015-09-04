define(['backbone'], function(Backbone){
	'use strict';

	var StatsModel = Backbone.Model.extend({

		defaults : {
			summoner : {
				name : null,
				profileIconUrl : null,
				tier : null
			},

			games : 0,

			wins : 0,

			losses : 0,

			kills : 0,

			deaths : 0,

			assists : 0
		},

		toJSON : function(){
			var json = Backbone.Model.prototype.toJSON.call(this);
			if (json.summoner.profileIconId){
				json.summoner.profileIconUrl = 'http://ddragon.leagueoflegends.com/cdn/5.2.1/img/profileicon/'+json.summoner.profileIconId+'.png';
			}
			json.winRate = json.wins/json.games;
			json.averageKills = json.kills/json.games;
			json.averageDeaths = json.deaths/json.games;
			json.averageAssists = json.assists/json.games;
			return json;
		}

	});

	return StatsModel;

});