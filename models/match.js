var mongoose = require('mongoose');
var schema = new mongoose.Schema({

	_id : Number,

	matchCreation : {type:Number, required:true},

	matchDuration : Number,

	matchVersion : String,

	participants : [{
		summonerId : Number,
		matchHistoryUri : String,
		championId : Number,
		highestAchievedSeasonTier : String,
		spell1Id : Number,
		spell2Id : Number,
		stats : Object,
		timeline : Object,
		teamId : Number
	}],

	platformId : String,

	region : String,

	season : String

});


schema.virtual('matchId').get(function(){
	return this._id;
}).set(function(value){
	this._id = value;
});


module.exports = mongoose.model('Match', schema);

/**
 * helper function for quickly finding an object in an given array by its property(ies)
 * @global
 * @param match {object} Object containing key/value pairs to match off of
 * @returns {object} First object in array found that matches all key/value pairs passed in
 */
/* jshint ignore:start */
function find(array, match) {
	'use strict';
	var obj, key, i = this.length;
	loop1 : while (i--) {
		obj = this[i];
		for (key in match) {
			if (match.hasOwnProperty(key) && obj[key] !== match[key]) {
				continue loop1;
			}
		}
		return obj;
	}
	return null; //No matches found
};