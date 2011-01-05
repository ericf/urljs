/**
 * Link Tests
 */

YUI.add('ttw-link-test', function(Y){
	
	var matchSuite		= new Y.Test.Suite('Link - Matching'),
		sanitizeSuite	= new Y.Test.Suite('Link - Sanitize');
	
	// *** Protocol Match TestCase *** //
	
	matchSuite.add(buildMatchTestCase('Protocol Match', [
	
		// Allow
		
		'http://example.com',
		'https://example.com',
		'hTTp://example.com',
		'HttpS://example.com',
		'example.com'
	
	], [
	
		// Reject
		
		'asdf://example.com',
		'//example.com',
		'http:example.com',
		' http://example.com'
	
	]));
	
	// *** Authorization Match TestCase *** //
	
	matchSuite.add(buildMatchTestCase('Authorization Match', [
	
		// Allow
		
		'http://foo:bar@example.com',
		'http://foo@example.com'
	
	], [
	
		// Reject
		
		'http:// foo:bar@example.com',
		'http://foo:bar@ example.com',
		'http://foo:example.com',
		'http://foo:@example.com',
		'http://:bar@example.com'
	
	]));
	
	// *** Host Match TestCase *** //
	
	matchSuite.add(buildMatchTestCase('Host Match', [
	
		// Allow
		
		'http://example.com',
		'http://e.com',
		'http://e.us',
		'http://foo.example.com',
		'http://foo.bar.example.us',
		'http://foo.bar.baz.zee.example.com',
		'http://WWW.example.com',
		'http://www.Example.com'
	
	], [
	
		// Reject
		
		'http://a',
		'http://a.b',
		'http://a..b',
		'http://example.com.',
		'http:// example.com',
		'http://exa mple.com',
		'http://example .com',
		'http://example',
		'http://example.',
		'http://example.&com'
	
	]));
	
	// *** Port Match TestCase *** //
	
	matchSuite.add(buildMatchTestCase('Port Match', [
	
		// Allow
		
		'http://example.com:8',
		'http://example.com:808080'
	
	], [
	
		// Reject
		
		'http://example.com :80',
		'http://example.com:8 0',
		'http://example.com:asdf'
		
	]));
	
	// *** Path Match TestCase *** //
	
	matchSuite.add(buildMatchTestCase('Path Match', [
	
		// Allow
		
		'http://example.com/',
		'http://example.com/foo',
		'http://example.com/foo/',
		'http://example.com/foo/bar',
		'http://example.com/foo/bar/',
		'http://example.com/foo ',
		'http://example.com/ foo',
		'http://example.com/ foo /'
		
	], [
	
		// Reject
		
		'http://example.com /',
		'http://exmaple.com\\'
		
	]));
	
	// *** Query Match TestCase *** //
	
	matchSuite.add(buildMatchTestCase('Query Match', [
		
		// Allow
		
		'http://exmaple.com?',
		'http://exmaple.com?foo',
		'http://exmaple.com?foo=',
		'http://exmaple.com?foo=bar',
		'http://exmaple.com/?',
		'http://exmaple.com/?foo',
		'http://exmaple.com/?foo=',
		'http://exmaple.com/?foo=bar',
		'http://exmaple.com/?foo=bar&',
		'http://exmaple.com/?foo=bar&baz',
		'http://exmaple.com/?foo=bar&baz=zee'
		
	]));
	
	// *** Fragment Match TestCase *** //
	
	matchSuite.add(buildMatchTestCase('Fragment Match', [
		
		// Allow
		
		'http://example.com#',
		'http://example.com#foo',
		'http://example.com/#',
		'http://example.com/#foo',
		'http://example.com/#foo=bar',
		'http://example.com/#foo/bar',
		'http://example.com/#!/foo/bar',
		'http://example.com/#!/foo/?bar=baz'
	
	], [
	
		// Reject
		
		'http://example.com.#'
		
	]));
	
	// *** Full Match TestCase *** //
	
	matchSuite.add(buildMatchTestCase('Full Match', [
	
		// Allow
		
		'http://www.google.com/photo?bar',
		'Http://www.google.com/phone',
		'http://twitter.com/?_escaped_fragment_=/ericf',
		'HttpS://foo:bar@example.com:8080/~foo/',
		'http://foo:bar@example.com:8080/~foo/baz?zee=true'
		
	]));
	
	// *** Protocol Sanitize TestCase *** //
	
	sanitizeSuite.add(buildSanitizeTestCase('Protocol Sanitize', {
		
		'http://example.com'	: 'http://example.com/',
		'https://example.com'	: 'https://example.com/',
		'hTTp://example.com'	: 'http://example.com/',
		'HttpS://example.com'	: 'https://example.com/',
		'example.com'			: 'http://example.com/',
		' http://example.com'	: 'http://example.com/'
		
	}));
	
	// *** Authorization Sanitize TestCase *** //
	
	sanitizeSuite.add(buildSanitizeTestCase('Authorization Sanitize', {
		
		'http://foo:bar@example.com'	: 'http://foo:bar@example.com/',
		'http://Foo:BAR@example.com'	: 'http://Foo:BAR@example.com/'
		
	}));
	
	// *** Host Sanitize TestCase *** //
	
	sanitizeSuite.add(buildSanitizeTestCase('Host Sanitize', {
		
		'http://example.com'	: 'http://example.com/',
		'http://Example.com'	: 'http://example.com/',
		'http://EXAMPLE.COM'	: 'http://example.com/',
		'http://example.com '	: 'http://example.com/'
		
	}));
	
	// *** Port Sanitize TestCase *** //
	
	sanitizeSuite.add(buildSanitizeTestCase('Port Sanitize', {
		
		'http://example.com:8'		: 'http://example.com:8/',
		'http://example.com:8080'	: 'http://example.com:8080/',
		'http://example.com:8080 '	: 'http://example.com:8080/'
		
	}));
	
	// *** Path Sanitize TestCase *** //
	
	sanitizeSuite.add(buildSanitizeTestCase('Path Sanitize', {
		
		'http://example.com/'			: 'http://example.com/',
		'http://example.com/foo'		: 'http://example.com/foo',
		'http://example.com/foo/'		: 'http://example.com/foo/',
		'http://example.com/ '			: 'http://example.com/',
		'http://example.com/foo '		: 'http://example.com/foo',
		'http://example.com/foo/ '		: 'http://example.com/foo/',
		'http://example.com/FOO'		: 'http://example.com/FOO',
		'http://example.com/ foo'		: 'http://example.com/ foo',
		'http://example.com/ foo '		: 'http://example.com/ foo',
		'http://example.com/ foo /'		: 'http://example.com/ foo /'
		
	}));
	
	// *** Query Sanitize TestCase *** //
	
	sanitizeSuite.add(buildSanitizeTestCase('Query Sanitize', {
		
		'http://exmaple.com?'					: 'http://exmaple.com/',
		'http://exmaple.com?foo'				: 'http://exmaple.com/?foo',
		'http://exmaple.com?foo='				: 'http://exmaple.com/?foo',
		'http://exmaple.com?foo=bar'			: 'http://exmaple.com/?foo=bar',
		'http://exmaple.com/?'					: 'http://exmaple.com/',
		'http://exmaple.com/?foo'				: 'http://exmaple.com/?foo',
		'http://exmaple.com/?foo='				: 'http://exmaple.com/?foo',
		'http://exmaple.com/?foo=bar'			: 'http://exmaple.com/?foo=bar',
		'http://exmaple.com/?foo=bar&'			: 'http://exmaple.com/?foo=bar',
		'http://exmaple.com/?foo=bar&baz'		: 'http://exmaple.com/?foo=bar&baz',
		'http://exmaple.com/?foo=bar&baz=zee'	: 'http://exmaple.com/?foo=bar&baz=zee'
		
	}));
	
	// *** Fragment Santize TestCase *** //
	
	sanitizeSuite.add(buildSanitizeTestCase("Fragment Sanitize", {
		
		'http://example.com#'					: 'http://example.com/',
		'http://example.com#foo'				: 'http://example.com/#foo',
		'http://example.com/#'					: 'http://example.com/',
		'http://example.com/#foo'				: 'http://example.com/#foo',
		'http://example.com/#foo=bar'			: 'http://example.com/#foo=bar',
		'http://example.com/#foo/bar'			: 'http://example.com/#foo/bar',
		'http://example.com/#!/foo/bar'			: 'http://example.com/#!/foo/bar',
		'http://example.com/#!/foo/?bar=baz'	: 'http://example.com/#!/foo/?bar=baz'
		
	}));
	
	// *** Full Sanitize TestCase *** //
	
	sanitizeSuite.add(buildSanitizeTestCase('Full Sanitize', {
		
		'http://local.tiptheweb.org:8080'					: 'http://local.tiptheweb.org:8080/',
		'http://local.tiptheweb.org:8080/'					: 'http://local.tiptheweb.org:8080/',
		'http://local.tiptheweb.org:8080/foo'				: 'http://local.tiptheweb.org:8080/foo',
		'http://local.tiptheweb.org:8080?foo=bar'			: 'http://local.tiptheweb.org:8080/?foo=bar',
		'http://local.tiptheweb.org:8080#foo'				: 'http://local.tiptheweb.org:8080/#foo',
		'HTTPS://local.TipTheWeb.org:8080?foo=bar#baz'		: 'https://local.tiptheweb.org:8080/?foo=bar#baz',
		'HTTPS://local.TipTheWeb.org:8080/zee?foo=bar#baz'	: 'https://local.tiptheweb.org:8080/zee?foo=bar#baz',
		'HTTPS://local.TipTheWeb.org:8080/zee/?foo=bar#baz'	: 'https://local.tiptheweb.org:8080/zee/?foo=bar#baz',
		'http://www.google.com/phone?foo'					: 'http://www.google.com/phone?foo',
		'http://tiptheweb.org/#foo'							: 'http://tiptheweb.org/#foo',
		'http://tiptheweb.org/#'							: 'http://tiptheweb.org/',
		'http://tiptheweb.org/?'							: 'http://tiptheweb.org/',
		'http://tiptheweb.org?'								: 'http://tiptheweb.org/',
		'http://tiptheweb.org#foo'							: 'http://tiptheweb.org/#foo',
		'http://www.google.com/phone'						: 'http://www.google.com/phone',
		'HttpS://foo:bar@example.com:8080/~foo/'			: 'https://foo:bar@example.com:8080/~foo/',
		'Http://foo:BAR@example.COM:8080/~Foo/baz?zee=true'	: 'http://foo:BAR@example.com:8080/~Foo/baz?zee=true'
		
	}));
	
	Y.Test.Runner.add(matchSuite);
	Y.Test.Runner.add(sanitizeSuite);
	
	function buildMatchTestCase (name, allows, rejects) {
		
		var config = {};
		
		config.name = name;
		config._should = {};
		config._should.fail = {};
		
		Y.each(allows, function(allow){
			config[allow + ' - should allow'] = function(){
				Y.assert(allow.match(Y.TTW.Link.URL_REGEXP));
			}
		});
		
		Y.each(rejects, function(reject){
			var testName = reject + ' - should reject';
			config._should.fail[testName] = true;
			config[testName] = function(){
				Y.assert(reject.match(Y.TTW.Link.URL_REGEXP));
			}
		});
		
		return new Y.Test.Case(config);
	}
	
	function buildSanitizeTestCase (name, urls) {
		
		var config = { name: name };
		
		Y.each(urls, function(sanitizedUrl, dirtyUrl){
			config[dirtyUrl + ' - should sanitize as: ' + sanitizedUrl] = function(){
				Y.Assert.areSame(sanitizedUrl, Y.TTW.Link.sanitize(dirtyUrl));
			}
		});
		
		return new Y.Test.Case(config);
	}
	
}, '@VERSION@', { requires: ['test', 'ttw-link-base'] });
