define(['underscore','backbone','txt!tpl/form.html','bootstrap'],
	function (_, Backbone, formTpl) {
		'use strict';

		var FormView = Backbone.View.extend({

			el : '#content',

			template : _.template(formTpl),

			// The DOM events specific to an item.
			events : {
				'keyup .form-control' : 'updateSummonerName',
				'change .form-control' : 'updateSummonerName',
				'click .region' : 'updateRegion',
				'click #submit' : 'onSubmit'
			},

			render : function () {
				this.$el.html(this.template(this.model.toJSON()));
				return this;
			},

			updateSummonerName : function(evt){
				var $input = $(evt.currentTarget);
				var summoners = this.model.get('summoners');

				if ($input.attr('id') === 'summonerInput1'){
					summoners[0] = $input.val();
				}else{
					summoners[1] = $input.val();
				}

				this.$('#submit').prop('disabled', !summoners[0].length || !summoners[1].length);
			},

			updateRegion : function(evt){
				var $region = $(evt.currentTarget);
				this.model.set('region', $region.attr('data-value'));
				this.render();
			},

			onSubmit : function(){
				this.model.save();
				this.trigger(Events.TO_STATS);
			}
		});

		return FormView;
	}
);