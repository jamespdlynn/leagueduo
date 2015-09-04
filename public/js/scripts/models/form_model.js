define(['jquery','backbone'], function($,Backbone){
	'use strict';

	var FormModel = Backbone.Model.extend({

		defaults : {

			region : 'NA', //TODO set default based on users IP

			summoners : ['', ''],

			availableRegions : {
				'NA' : 'North America',
				'EUW' : 'Europe West',
				'EUNE' : 'Europe East',
				'KR' : 'Korea',
				'OCE' : 'Oceania',
				'LAN' : 'Latin America North',
				'LAS' : 'Latin America South',
				'RU' : 'Russia',
				'TR' : 'Turkey'
			},

			errorMessage : null
		},

		//retrieve data in from local storage
		initialize : function(){
			if (localStorage){
				var data = localStorage.getItem('form');
				if (data){
					try{
						this.set(JSON.parse(data));
					}catch(err){
						console.error(err);
					}
				}
			}
		},

		//override save to store in localstorage
		save : function(){
			if (localStorage){
				localStorage.setItem('form', this.toString());
			}
		},

		toString : function(){
			var json = this.toJSON();
			delete json.availableRegions;
			delete json.errorMessage;
			return JSON.stringify(json);
		},

		toParams : function(){
			var json = this.toJSON();
			delete json.availableRegions;
			delete json.errorMessage;
			return $.param(json);
		}

	});

	return FormModel;


});