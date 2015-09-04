/**
 * Node JS Server
 * @author James Lynn
 */
require('./utils');

var path = require('path');
var express = require('express');
var router = require('./controllers/router');

var app = express();

app.set('env', process.env.NODE_ENV);
app.set('port', config.server.server_port);

switch (app.get('env')) {
	//Development Environment
	case 'development':
		var less = require('less-middleware');
		app.use(less(path.join(__dirname,'public'),{
			dest : path.join(__dirname, 'public'),
			compress : false,
			debug : true,
			force : true
		}));

		var errorHandler = require('errorhandler');
		app.use(errorHandler());

		app.use(express.static(path.join(__dirname, 'public')));
		break;

	//Production Environment
	case 'production':
	default :
		var compression = require('compression');
		app.use(compression);

		app.use(express.static(path.join(__dirname,'dist')));
		break;
}

//Bootstrap api router
router(app);

//Kick up a new express server on the given port
app.listen(app.get('port'), function(){
	'use strict';
	console.log('Express '+app.get('env')+' server listening on port '+app.get('port'));
});


