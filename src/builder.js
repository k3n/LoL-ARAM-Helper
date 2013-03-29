function Builder(cfg) {
	this.HB = require('handlebars');
	this.fs = require('fs');
	this.tpls = {};
	this.scriptTags = [];
	cfg.encoding = 'utf8';
	this.cfg = cfg;
	this.debug = cfg.debug ? this.log : function(){};
}

Builder.prototype = {

	build: function() {
		this.start();
		this.r_js();
		this.scripts();
		this.html();
		this.stop();
		return this;
	},

	start: function start() {
		this.log('Build starting.');
		this.t_start = Date.now();
		return this;
	},

	stop: function start() {
		this.log('Build complete (~%ss).', ((Date.now() - this.t_start) / 1000).toFixed(2));
		return this;
	},

	r_js: function r_js() {
		this.debug('r.js processing: "%s".', this.cfg.out.js);

		this.scriptTags.unshift(this.toHtml(this.cfg.out.js));

		var that = this;
		require('requirejs').optimize(this.cfg.r_js, function (buildResponse) {
		    // buildResponse is just a text output of the modules
		    // included. Load the built file for the contents.
		    // Use this.cfg.out to get the optimized file contents.
		    // var contents = fs.readFileSync(config.out, 'utf8');
//		    fs.writeFile('./buildResponse.js', buildResponse, that.cfg.encoding);
		}, function(err) {
		    if (err) {
		    	throw err;
		    }
		});

		this.debug('r.js complete.');

		return this;
	},

	scripts: function scripts() {		
		this.debug('Preparing scripts.');

		var html = [],
			toHtml = this.toHtml.bind(this),
			scripts = this.cfg.scriptTags;

		for (var path in scripts) {
			this.scriptTags.push(toHtml(path, scripts[path]));
		}

		this.debug('Scripts generated.');

		return this;
	},

	toHtml: function toHtml(src, inline) {
		var tplHtml;

		if (inline) {
			tplHtml = this.tpls.inline || (this.tpls.inline = this.HB.compile('<script>\n{{{src}}}\n</script>'));
			src = this.fs.readFileSync(src, this.cfg.encoding);
		} else {
			tplHtml = this.tpls.linked || (this.tpls.linked = this.HB.compile('<script src="{{{src}}}"></script>'));
		}

		return tplHtml({src: src});
	},

	html: function html() {
		this.debug('Preparing HTML.');

		var srcHtml = this.fs.readFileSync(this.cfg.out.tpl, this.cfg.encoding),
			tplHtml = this.HB.compile(srcHtml),
			scriptTags = this.scriptTags.join(String.fromCharCode(10)),
			html = tplHtml({scriptTags: scriptTags});

		this.fs.writeFile(this.cfg.out.dir + this.cfg.out.html, html, this.cfg.encoding);

		this.debug('HTML generated.');

		return this;
	},

	log: function log() {
		return console.log.apply(this, arguments);
	}
};

module.exports = Builder;