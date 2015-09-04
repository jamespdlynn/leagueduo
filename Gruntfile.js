/**
 * Grunt Automation Task Runner
 * @author James lynn
 */
module.exports = function (grunt) {
	'use strict';

	require('load-grunt-tasks')(grunt);

	// Grunt Config
	grunt.initConfig({

		clean: {
			build: ['build'],
			dist : ['dist']
		},

		copy: {

			build : {files: [
				{
					cwd: 'public/',
					expand: true,
					dest: 'build/',
					src: '**/*'
				}
			]},

			dist : {files: [
				{
					cwd: 'build/img',
					expand: true,
					src: '**/*',
					dest: 'dist/img',
				},
				{
					src: 'build/js/lib/require.js',
					dest: 'dist/js/lib/require.js'
				},
				{
					src: 'build/index.html',
					dest: 'dist/index.html'
				},
				{
					src: 'build/favicon.ico',
					dest: 'dist/favicon.ico'
				}
			]}
		},

		less: {
			target : {
				options: {
					compress : true
				},
				files : {'dist/css/style.css' : 'build/css/style.less'}
			}

		},

		requirejs: {
			compile: {
				options: {
					baseUrl : 'build/js/scripts',
					name : '../main',
					mainConfigFile: 'build/js/main.js',
					out: 'dist/js/main.js',
					paths: {
						jquery: 'empty:' //exclude jquery from the build and pull it in through the CDN instead
					}
				}
			}
		}
	});
	//Deploy a production build to the 'dist' directory
	grunt.registerTask('default', [

		'clean', //Delete both build and dist directories

		'copy:build', //Copy source files to temporary build directory

		'less', //Compile and compress LESS files to css

		'requirejs', //Combine and minify javascript using the require js optimizer

		'copy:dist', //Copy remaining files to dist directory

		'clean:build' //Delete temporary build directory

	]);

};