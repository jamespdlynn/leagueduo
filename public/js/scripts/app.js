define(['jquery', 'models/form_model', 'views/form_view', 'models/stats_collection', 'views/stats_view', 'txt!tpl/modal.html'],
	function ($, FormModel, FormView, StatsCollection, StatsView, modalTpl){
		'use strict';

		/**
		 * @global
		 * @readonly
		 * @type {{TO_STATS: string, TO_FORM: string}}
		 */
		window.Events = {
			TO_STATS : 'toStats',
			TO_FORM : 'toForm'
		};

		var formModel, formView, statsCollection, statsView, $loadModal;

		var app = {

			//Initialize app
			start : function(){
				formModel = new FormModel;
				formView = new FormView({
					model : formModel
				});

				statsCollection = new StatsCollection();
				statsView = new StatsView({
					collection : statsCollection
				});

				$loadModal = $(modalTpl).modal({show:false});

				formView.on(Events.TO_STATS, this.getStats);
				statsView.on(Events.TO_FORM, this.toForm);

				formView.render();
			},

			//Retrieve stats data from server
			getStats : function(){

				statsCollection.reset();
				formModel.set('errorMessage', null);
				formView.render();

				$loadModal.modal('show');

				$.get('/stats?'+formModel.toParams())

					.success(function(res){
						//parse returned statistics object into array
						statsCollection.add([
							res.stats[res.summoners[0]],
							res.stats.combined,
							res.stats[res.summoners[1]]
						]);

						statsView.render();
					})

					.fail(function(err){
						if (err.status == 404){
							formModel.set('errorMessage', 'Unable to retrieve data. Please check that summoner names and region are correct.');
						}else{
							formModel.set('errorMessage', 'Something went wrong. Please try again later.');
							console.error(err.message || err);
						}
						formView.render();
					})

					.always(function(){
						$loadModal.modal('hide');
					});
			},

			toForm : function(){
				statsCollection.reset();
				formView.render();
			}
		};

		return app;
	}

);
