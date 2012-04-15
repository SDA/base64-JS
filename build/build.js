// Dependencies
var exec = require('child_process').exec;
var fs = require('fs-extra');
var seq = require('seq');

// Do the build.
var build = {};
seq()
	.seq(function () {
		// Read in the project version.
		fs.readFile('VERSION', 'ascii', this);
	})
	.seq(function(version) {
		// Save the version number for later.
		build.version = '' + version;

		// Copy raw JS, if required.
		fs.copyFileSync('lib/base64.js', 'dist/base64-' + build.version + '.js');

		// Minify JS.
		exec('java -jar build/closure/compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js lib/base64.js --js_output_file dist/base64-' + build.version + '.min.js', this);

		// Alternatively, use jsmin. It doesn't compress as much as the closure compiler.
		/*
		var jsmin = require('jsmin').jsmin;
		var minified = jsmin(css, 3);
		*/
	});
