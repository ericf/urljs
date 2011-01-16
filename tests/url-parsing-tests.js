/**
 * URL.js Parsing Tests
 */

YUI.add('url-parsing-tests', function(Y){
	
	var parsingSuite			= new Y.Test.Suite('URL.js Parsing Tests'),
		buildEqualityTestCase	= Y.TestUtils.buildEqualityTestCase,
		urls;
		
	urls = {
		
		'http://example.com' : {
			scheme		: 'http',
			userInfo	: undefined,
			host		: 'example.com',
			port		: undefined,
			path		: '/',
			query		: undefined,
			fragment	: undefined
		},
		
		'https://user@example.com:8080' : {
			scheme		: 'https',
			userInfo	: 'user',
			port		: 8080,
			authority	: 'user@example.com:8080'
		},
		
		'https://user:pass@example.com:8080' : {
			scheme		: 'https',
			userInfo	: 'user:pass',
			port		: 8080,
			authority	: 'user:pass@example.com:8080'
		},
		
		'//www.example.com/foo?bar#baz' : {
			isValid		: true,
			isAbsolute	: true,
			scheme		: undefined,
			host		: 'www.example.com',
			domain		: 'example.com',
			path		: '/foo',
			queryString	: 'bar',
			fragment	: 'baz'
		},
		
		'www.example.com' : {
			isValid	: true,
			type	: 'relative',
			path	: 'www.example.com'
		},
		
		'foo/bar/' : {
			isValid			: true,
			isRelative		: true,
			isHostRelative	: false,
			path			: 'foo/bar/'
		},
		
		'Http://Example.com' : {
			toString	: 'http://example.com/',
			path		: '/'
		},
		
		'http//example.com'					: { isValid : false, isRelative: true },	// TODO fixme
		':example.com'						: { isValid : false },	// TODO fixme
		'a://example.com'					: { isValid : false },	// TODO fixme
		'http://example.com:asdf'			: { isValid : false },
		'https://user:passexample.com:8080'	: { isValid : false },
		
	};
	
	// *** Add Test Suite *** //
	
	Y.each(urls, function(tests, url){
		parsingSuite.add(buildEqualityTestCase(url, Y.bind(URL, this, url), function(testCase, test, url){
			return url[test]();
		}, tests));
	});
	
	Y.Test.Runner.add(parsingSuite);
	
}, '0.1', { requires: ['test', 'test-utils'] });
