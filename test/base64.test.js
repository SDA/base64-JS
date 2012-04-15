QUnit.module('base64');

QUnit.test('base64', function () {
	var plaintext = 'Hello world!';
	var encoded = base64.encode(plaintext);
	var decoded = base64.decode(encoded);
	ok(decoded === plaintext, 'base64');
});
