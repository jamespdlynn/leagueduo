var mongoose = require('mongoose');
var schema = new mongoose.Schema({

	_id : String,

	region : {type:String, required:true, lowercase: true, trim: true, validate:isValidRegion},

	matches : [{ type: Number, ref: 'Match' }],

	summoners : [{
		id : Number,
		name : {type:String, required:true},
		profileIconId : Number
	}]
});

schema.pre('save', function(next){

	if (!this.summoners.length){
		throw new Error('Group must have at least one summoner attached');
	}

	//Dynamically set a unique identifier for this document when first created
	this._id =  this._id || generateId(this.summoners, this.region);

	//Depopulate matches
	this.matches = this.matches.map(function(match){
		return (typeof match==='object') ? match.matchId : match;
	});

	next();
});

/**
 * Returns the most recent creation time of all associated match models
 * @returns {number}
 */
schema.method('getMostRecentMatchTime', function(){
	if (!this.matches || !this.matches.length) {
		return Promise.resolve(0);
	}

	//Have to first make sure matches are populated with match creation data
	return this.populate({path:'matches',select:'matchCreation'}).execPopulate()
		.then(function(group){

			return group.matches.map(function(match){
				return match.matchCreation;
			}).max();

		});
});

schema.static('generateId', generateId);

schema.static('isValidRegion', isValidRegion);

schema.set("toJSON", {
	virtuals : true,
	transform : function(doc, ret){
		delete ret._id;
		return ret;
	}
});

module.exports = mongoose.model('Group', schema);

/**
 * @param {[string] | [object]} summoners
 * @param {string} region
 * @returns {string}
 */
function generateId(summoners, region){
	if (!summoners || !summoners.length){
		return '';
	}

	//map array values to strings if necessary
	summoners = summoners.map(function(summoner){
		if (typeof summoner === 'object'){
			summoner = summoner.name;
		}
		return summoner.toKey();
	});

	return region.toLowerCase() + '-' + summoners.sort().join('-');
}

/**
 * @param {string} region
 * @returns {boolean}
 */
function isValidRegion(region){
	return ~['na','eune','euw','kr','ln','las','br','oce','ru','tr'].indexOf(region);
}

