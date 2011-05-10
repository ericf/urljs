/**
 * URL.js Resolving Tests
 */

YUI.add('url-resolving-tests', function(Y){
    
    var resolvingSuite          = new Y.Test.Suite('URL.js Resolving Tests'),
        buildEqualityTestCase   = Y.TestUtils.buildEqualityTestCase,
        urls;
        
    urls = {
        
        'http://example.com/' : {
            'foo/bar/'                  : 'http://example.com/foo/bar/',
            '../../'                    : 'http://example.com/',
            '../foo.html'               : 'http://example.com/foo.html',
            '//example.com/foo'         : 'http://example.com/foo',
            'https://example.com/'      : 'https://example.com/',
            'http://www.example.com'    : 'http://www.example.com/'
        },
        
        'http://example.com/foo' : {
            '?bar=baz'  : 'http://example.com/foo?bar=baz',
            '/bar'      : 'http://example.com/bar',
            '../#foo'   : 'http://example.com/#foo'
        },
        
        'http://tiptheweb.org/foo/bar/zee/' : {
            '../../cool?baz=zee' : 'http://tiptheweb.org/foo/cool?baz=zee'
        }
        
    };
    
    // *** Add Test Suite *** //
    
    Y.each(urls, function(tests, url){
        resolvingSuite.add(buildEqualityTestCase(url, Y.bind(URL, this, url), function(testCase, test, url){
            return url.resolve(test).toString();
        }, tests));
    });
    
    Y.Test.Runner.add(resolvingSuite);
    
}, '0.1', { requires: ['test', 'test-utils'] });
