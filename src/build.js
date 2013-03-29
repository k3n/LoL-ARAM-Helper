(function(){

	var cfg = {
		debug: true,
		out: {
			dir: '../dist/',
			js: 'js/app.min.js',
			html: 'index.html',
			tpl: 'tpl/index.tpl'
		},
		r_js: {
		    baseUrl: '.',
		    paths: {
		        jquery: 'components/jquery/jquery'
		    },
		    include: ['js/run'],
		    name: 'components/almond/almond',
		    out: ''
		},
		scriptTags: {
		}
	};

	cfg.r_js.out = cfg.out.dir + cfg.out.js;

	var Builder = require('./builder'), 
		builder = new Builder(cfg);

	builder.build();

})();