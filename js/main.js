$(document).ready(function() {	

	App = {};
	App.options = {
		'lang' : 'eng'
	}
	App.currentView = "home";

	$.get('data/strings.json', function(data) {
		App.strings = data;
		initBackbone();
		updateHeader();
	});
	
});

function initStrings() {

	$('[data-string]').each(function() {
		$(this).html(App.strings[App.options.lang][$(this).attr('data-string')]);
	})

}

function initBackbone(articles) {

	var ApplicationRouter = Backbone.Router.extend({
	    routes: {
	    	"" : "home",
			"home": "home",
			"articles": "articles",
			"aboutme": "aboutme",
			"contact": "contact"
	    },
	    home: function() {
	    	new DefaultView('#template_home');
	    },
	    articles: function() {
	    	App.articlesCollection = new ArticlesCollection();
			App.articlesCollection.fetch({
				success : function() {
					new ArticlesView();
					initStrings();
				}
			});
	    },
	    aboutme: function() {
	    	new DefaultView('#template_aboutme');
	    },
	    contact: function() {
	    	new DefaultView('#template_contact');
	    }
	});

	var ArticleModel = Backbone.Model.extend();

	var ArticlesCollection = Backbone.Collection.extend({
		model : ArticleModel,
		url : 'data/articles.json'
	});

	var ArticlesView = Backbone.View.extend({
		el: '.js-main-content',
		initialize: function() {
			this.render();
		},
		render: function() {
			App.articlesCollection.each(function(item) {
				$('.js-list-of-selectors').append(new ArticleSelectorView(item));
			})	
		}
	});

	var DefaultView = Backbone.View.extend({
		el: '.js-main-content',
		initialize: function(templateId) {
			this.render(templateId);
		},
		render: function(templateId) {
			this.$el.html(_.template($(templateId).html(), {}));
			initStrings();
		}
	});

	var ArticleSelectorView = Backbone.View.extend({
		tagName : 'li',
		className : 'clearfix',
		initialize: function(item) {
			this.render(item);
		},
		render: function(item) {
			debugger;
			this.$el.html(_.template($('#template_article_selector'), item));
		}
	})

	App.router = new ApplicationRouter();
	
	Backbone.history.start();

	App.router.on('route', function() {
		updateHeader();
	});
	
}

function updateHeader() {	
	$('li a').removeClass('active').filter('[data-view="' + Backbone.history.getFragment() + '"]').parent().addClass('active');
}