(function (define) {
	define('base64', [], function() {

		if (typeof window === 'undefined') window = {};

		var utf8_encode = function(string) {
			// Normalize line endings.
			string = string.replace(/\r\n/g, '\n');

			// Encode each character.
			var utftext = '';
			for (var n = 0; n < string.length; n++) {	 
				var c = string.charCodeAt(n);
				if (c < 128) {
					utftext += String.fromCharCode(c);
				}
				else if ((c > 127) && (c < 2048)) {
					utftext += String.fromCharCode((c >> 6) | 192);
					utftext += String.fromCharCode((c & 63) | 128);
				}
				else {
					utftext += String.fromCharCode((c >> 12) | 224);
					utftext += String.fromCharCode(((c >> 6) & 63) | 128);
					utftext += String.fromCharCode((c & 63) | 128);
				}
			}

			// Return the encoded UTF8 string.
			return utftext;
		}

		var utf8_decode = function(utf8) {
			var string = "";
			var i = 0;
			var c = c1 = c2 = 0;	 
			while (i < utf8.length) {
				c = utf8.charCodeAt(i);
				if (c < 128) {
					string += String.fromCharCode(c);
					i++;
				}
				else if ((c > 191) && (c < 224)) {
					c2 = utftext.charCodeAt(i+1);
					string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
					i += 2;
				}
				else {
					c2 = utftext.charCodeAt(i+1);
					c3 = utftext.charCodeAt(i+2);
					string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
					i += 3;
				}
			}
			return string;
		}

		var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

		// Singleton instance.
		var instance = null;

		var base64 = function() {
			// Prevent multiple instances from being created.
			if (instance !== null) {
				throw new Error("Can't instantiate more than one base64 instance");
			}
		}

		var encode = function(plaintext) {
			var output = '';
			var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
			var i = 0;

			plaintext = utf8_encode(plaintext);

			while (i < plaintext.length) {
	 
				chr1 = plaintext.charCodeAt(i++);
				chr2 = plaintext.charCodeAt(i++);
				chr3 = plaintext.charCodeAt(i++);
	 
				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;
	 
				if (isNaN(chr2)) {
					enc3 = enc4 = 64;
				}
				else if (isNaN(chr3)) {
					enc4 = 64;
				}
	 
				output = output +
					alphabet.charAt(enc1) + alphabet.charAt(enc2) +
					alphabet.charAt(enc3) + alphabet.charAt(enc4);
	 
			}
	 
			return output;
		}

		var decode = function(input) {
			var output = "";
			var chr1, chr2, chr3;
			var enc1, enc2, enc3, enc4;
			var i = 0;

			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

			while (i < input.length) {

				enc1 = alphabet.indexOf(input.charAt(i++));
				enc2 = alphabet.indexOf(input.charAt(i++));
				enc3 = alphabet.indexOf(input.charAt(i++));
				enc4 = alphabet.indexOf(input.charAt(i++));

				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;

				output = output + String.fromCharCode(chr1);

				if (enc3 != 64) {
					output = output + String.fromCharCode(chr2);
				}
				if (enc4 != 64) {
					output = output + String.fromCharCode(chr3);
				}

			}

			output = utf8_decode(output);

			return output;
		}

		base64.prototype = {
			encode: encode,
			decode: decode
		};

		var sharedInstance = function() {
			if (instance === null) {
				instance = new base64();
			}
			return instance;
		};

		// Return the singleton.
		return sharedInstance();
	});
}(typeof define === 'function' && define.amd ? define : function(name, deps, factory) {
	// node.js
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = factory(require);
	}

	// require.js
	else if (typeof require === 'function') {
		window['base64'] = factory(function(value) {
			return window[value];
		});
	}

	// web browsers
	else {
		window['base64'] = factory();
	}
}));
