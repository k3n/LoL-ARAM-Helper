// node ./node_modules/requirejs/bin/r.js -o build-config.js

(function(){

	var config = {
	    baseUrl: '.',
	    paths: {
	        jquery: 'components/jquery/jquery'
	    },
	    include: ['js/app'],
	    name: 'components/almond/almond',
	    out: '../dist/js/app.min.js'
	};

	var fs = require('fs'),
		requirejs = require('requirejs');

	// config = JSON.parse(fs.readFileSync('./config.js', 'utf8'));

	requirejs.optimize(config, function (buildResponse) {
	    //buildResponse is just a text output of the modules
	    //included. Load the built file for the contents.
	    //Use config.out to get the optimized file contents.
	    var contents = fs.readFileSync(config.out, 'utf8');
	}, function(err) {
	    //optimization err callback
	    if (err) {
	    	console.log(err);
	    	throw err;
	    }
	});

})();