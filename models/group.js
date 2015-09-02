var Q = require('q');
var mongoose = require('mongoose');
var Group = require('../models/group');
var schema = new mongoose.Schema({

	_id : String,

	region : {type:String, required:true, validate:isValidRegion},

	matches : [{ type: Number, ref: 'Match' }],

	summoners : [{
		id : {type:Number, required:true},
		name : {type:String, required:true},
		profileIconId : Number
	}]
});

schema.pre('save', function(next){

	//Dynamically set a unique identifier for this document when first created
	if (!this._id){
		if (!this.summoners || !this.summoners.length){
			throw new Error('Group must has at least one summoner attached');
		}

		this._id = toId(this.summoners, this.region);
	}

	next();
});

schema.method('getMostRecentMatch', function(){
	if (!this.matches || !this.matches.length) {
		return null;
	}

	return this.populate({path:'matches', select:'matchCreation'}).execPopulate()
		.then(function(group){
			return group.matches.min(function(match1, match2){
				return  match1.matchCreation < match2.matchCreation ? match1 : match2;
			});
		});
});

/**
 * @param {[string] | [object]} summoners
 * @param {string} region
 * @returns {Promise.<Group,Error>}
 */
schema.static('findBySummoners', function(summoners,region){
	return this.findById(toId(summoners,region)).exec();
});

/**
 * @param {[string] | [object]} summoners
 * @param {string} region
 * @returns {Promise.<Group,Error>}
 */
schema.static('removeBySummoners', function(summoners,region){
	return this.findByIdAndRemove(toId(summoners,region)).exec();
});

module.exports = mongoose.model('Group', schema);

/**
 * @param {[string] | [object]} summoners
 * @param {string} region
 * @returns {string}
 */
function toId(summoners, region){
	if (!summoners || !summoners.length){
		return '';
	}

	//map array values to strings if necessary
	summoners = summoners.map(function(summoner){
		if (typeof summoner === 'object'){
			summoner = summoner.name;
		}
		return summoner.toLowerCase().replace(/\s/g, '');
	});

	return region + '-' + summoners.sort().join('-');
}

/**
 * @param {string} region
 * @returns {boolean}
 */
function isValidRegion(region){
	return ~['na','eune','euw','kr','ln','las','br','oce','ru','tr'].indexOf(region);
}

