$(document).ready(function() {	

	App = {};
	App.options = {
		'lang' : 'eng',
        'defaultView' : 'home'
	};

	$.get('data/strings.json', function(data) {
		App.strings = data;
		initBackbone();
		updateHeader();
	});
	
});

function initStrings() {

	$('[data-string]').each(function() {
		$(this).html(App.strings[App.options.lang][$(this).attr('data-string')]);
	});

}

function initBackbone(articles) {

	var ApplicationRouter = Backbone.Router.extend({
	    routes: {
	    	"" : "home",
			"home": "home",
            "articles": "articles",
            "articles/:articleId": "articles",
			"aboutme": "aboutme",
			"contact": "contact"
	    },
	    home: function() {
	    	new DefaultView('#template_home');
	    },
	    articles: function(articleId) {
	    	App.articlesCollection = new ArticlesCollection();
			App.articlesCollection.fetch({
				success : function() {
					new ArticlesView(articleId);
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
		url : 'data/articles.json',
        comparator: function(a, b) {
            return -a.get('date').localeCompare(b.get('date'));
        }
	});

	var ArticlesView = Backbone.View.extend({
		el: '.js-main-content',
		initialize: function(articleId) {
			this.render(articleId);
		},
		render: function(articleId) {
            this.$el.html(_.template($('#template_articles').html(), {}));
			App.articlesCollection.each(function(item, index) {
				$('.js-list-of-selectors').append(new ArticleSelectorView(item).$el);
                $('.js-list-of-articles').append(new ArticleView(item).$el);
				if(item !== App.articlesCollection.last()) {
					$('.js-list-of-articles').append('<hr>');
				}
			});
            updateArticlesSelectors(articleId);
			makeArticlesSelectorsFixed();
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
		className : 'clearfix list-of-selectors__selector',
		events: {
			'click' : function() {
				$('html, body').animate({
					scrollTop : $('.js-article[data-article-id="' + this.$el.attr('data-article-id') + '"]').offset().top - $('#navbar').height() - 15
				}, 500, 'easeOutCubic');
			}
		},
		initialize: function(item) {
			this.render(item);
		},
		render: function(item) {
			this.$el.html(_.template($('#template_article_selector').html())(item.toJSON()));
            this.$el.attr('data-article-id', item.get('id'));
		}
	});

    var ArticleView = Backbone.View.extend({
        tagName : 'li',
        className : 'clearfix list-of-articles__article js-article',
        initialize: function(item) {
            this.render(item);
        },
        render: function(item) {
            this.$el.html(_.template($('#template_article').html())(item.toJSON()));
			this.$el.attr('data-article-id', item.get('id'));
			this.$el.attr('id', 'article-' + item.get('id'));
        }
    });

	App.router = new ApplicationRouter();
	
	Backbone.history.start();

	App.router.on('route', function() {
		console.log('route change');
		updateHeader();
	});
	
}

function updateHeader() {
	var currentView = Backbone.history.getFragment() === "" ? App.options.defaultView : Backbone.history.getFragment();
    if(currentView.indexOf('articles') !== -1) {
        currentView = "articles";
    }
	$('.navbar-nav li').removeClass('active').filter('[data-view="' + currentView + '"]').addClass('active');
}

function updateArticlesSelectors(articleId) {
    var articleId = articleId || App.articlesCollection.first().get('id');
    $('.js-list-of-selectors li').removeClass('active').filter('[data-article-id="' + articleId + '"]').addClass('active');
}

function makeArticlesSelectorsFixed() {
	var articlesSelectors = $('.js-articles-selectors').clone(true);
	articlesSelectors.css({
		'position' : 'fixed',
		'top' : $('.js-articles-selectors').offset().top,
		'left' : $('.js-articles-selectors').offset().left,
		'width' : $('.js-articles-selectors').outerWidth()
	});
	$('.js-articles-selectors').css('visibility', 'hidden').after(articlesSelectors);
}