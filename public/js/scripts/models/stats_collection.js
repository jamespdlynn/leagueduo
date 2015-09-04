define(['backbone','models/stats_model'], function(Backbone, StatsModel){
	'use strict';

	var StatsCollection = Backbone.Collection.extend({

		model : StatsModel

	});

	return StatsCollection;


});