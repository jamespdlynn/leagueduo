require.config({

	baseUrl: 'js/scripts',

	paths : {
		'jquery' : '../lib/jquery.min',
		'underscore' : '../lib/underscore.min',
		'backbone' : '../lib/backbone.min',
		'bootstrap' : '../lib/bootstrap.min',

		'txt' : '../lib/text',
		'tpl' : '../templates'
	},

	//JQuery, Underscore, and Backbone libraries are loaded in globally instead of as modules
	shim : {
		'jquery' : {
			exports : 'jQuery'
		},
		'underscore' : {
			exports : '_'
		},
		'bootstrap' : {
			deps: ['jquery']
		},
		'backbone' : {
			deps : ['jquery', 'underscore'],
			exports : 'Backbone'
		}
	},

	deps:['jquery','underscore','backbone']

});

//If jquery is already defined through a CDN we don't need to load it
if (window.jQuery){
	define('jquery', function(){
		return window.jQuery;
	});
}

require(['app'],function(app){
	app.start();
});