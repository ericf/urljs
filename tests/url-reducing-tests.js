/**
 * URL.js Reducing Tests
 */

YUI.add('url-reducing-tests', function(Y){
    
    var resolvingSuite          = new Y.Test.Suite('URL.js Reducing Tests'),
        buildEqualityTestCase   = Y.TestUtils.buildEqualityTestCase,
        urls;
        
    urls = {
        
        'http://example.com/' : {
            
            'http://tiptheweb.org'          : 'http://tiptheweb.org/',
            'https://example.com/'          : 'https://example.com/',
            '//example.com'                 : '/',
            '//example.com/foo/bar/'        : '/foo/bar/',
            'http://example.com/'           : '/',
            'http://example.com/?foo=bar'   : '/?foo=bar',
            'http://example.com?foo='       : '/?foo',
            'http://example.com/#foo'       : '/#foo',
            'http://example.com/foo/'       : '/foo/',
            '/foo/'                         : '/foo/',
            '../foo/'                       : '/foo/'
            
        },
        
        '/foo/' : {
            
            '/bar/'     : '/bar/',
            '../bar/'   : '/bar/',
            'bar/'      : '/foo/bar/',
            '?bar=baz'  : '/foo/?bar=baz'
            
        }
        
    };
    
    // *** Add Test Suite *** //
    
    Y.each(urls, function(tests, url){
        resolvingSuite.add(buildEqualityTestCase(url, Y.bind(URL, this, url), function(testCase, test, url){
            return url.reduce(test).toString();
        }, tests));
    });
    
    Y.Test.Runner.add(resolvingSuite);
    
}, '0.1', { requires: ['test', 'test-utils'] });
