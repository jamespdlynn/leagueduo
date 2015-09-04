define(['underscore','backbone','txt!tpl/stats.html','bootstrap'],
	function (_, Backbone, statsTpl) {
		'use strict';

		var StatsView = Backbone.View.extend({

			el : '#content',

			template : _.template(statsTpl),

			// The DOM events specific to an item.
			events : {
				'click #back' : 'backToForm'
			},

			render : function () {
				this.$el.html(this.template({
					collection : this.collection.toJSON()
				}));
				return this;
			},

			backToForm : function(){
				this.trigger(Events.TO_FORM);
			}
		});

		return StatsView;
	}
);