global.config = require('konfig')();

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect(config.server.mongo_url);

Array.prototype.min = function(comparer) {

	if (this.length === 0) return null;
	if (this.length === 1) return this[0];

	comparer = (comparer || Math.min);

	var v = this[0];
	for (var i = 1; i < this.length; i++) {
		v = comparer(this[i], v);
	}

	return v;
};

Array.prototype.max = function(comparer) {

	if (this.length === 0) return null;
	if (this.length === 1) return this[0];

	comparer = (comparer || Math.max);

	var v = this[0];
	for (var i = 1; i < this.length; i++) {
		v = comparer(this[i], v);
	}

	return v;
};

Array.prototype.intersect = function(array) {
	return this.filter(function(value){
		return ~array.indexOf(value);
	});
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