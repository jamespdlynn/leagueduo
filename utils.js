global.config = require('konfig')();

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect(config.server.mongo_url);

Array.prototype.min = function() {
	return Math.min.apply(null, this);
};

Array.prototype.max = function() {
	return Math.max.apply(null, this);
};

Array.prototype.intersect = function(array) {
	return this.filter(function(value){
		return ~array.indexOf(value);
	});
};

Array.prototype.prepend = function(array) {
	return Array.prototype.unshift.apply(this, array);
};


/* jshint ignore:start */
Array.prototype.find = function (match) {
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
/* jshint ignore:end */
