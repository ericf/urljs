/**
 * Test Utils
 */

YUI.add('test-utils', function(Y){
	
	var TestUtils = {};
	
	/**
	 * Builds a TestCase which tests a matcher Function against an array of expected- allowed and rejected strings.
	 * 
	 * @param {String} name - The name of the TestCase
	 * @param {Function | RegExp} matcher - Function or RegExp which is passed a String to test for a match
	 * @param {Array} allows - Set of Strings that should match
	 * @param {Array} rejects - Set of String that should NOT match
	 * @return {Y.Test.Case} new test case
	 */
	TestUtils.buildMatchTestCase = function (name, matcher, allows, rejects) {
		
		var config = {},
			matcherFn;
		
		matcherFn = Y.Lang.isFunction(matcher) ? matcher : function(s) {
			return s.match(matcher);
		};
		
		config.name = name;
		config._should = {};
		config._should.fail = {};
		
		Y.each(allows, function(allow){
			config[allow + ' - should allow'] = function(){
				Y.assert(matcherFn(allow));
			}
		});
		
		Y.each(rejects, function(reject){
			var testName = reject + ' - should reject';
			config._should.fail[testName] = true;
			config[testName] = function(){
				Y.assert(matcherFn(reject));
			};
		});
		
		return new Y.Test.Case(config);
	};
	
	/**
	 * Builds a TestCase which checks equality for the return value of each of the tests passed in.
	 * 
	 * @param {String} name - The name of the TestCase
	 * @param {Function} setupFn - Should return the start value for setUp when running each test
	 * @param {Function} valueFn - Used to return the actual value for each test
	 * @param {Object} tests - Object containing the set of tests - each member is the testName and value is the expected value
	 * @return {Y.Test.Case} new test case
	 */
	TestUtils.buildEqualityTestCase = function (name, setupFn, valueFn, tests) {
		
		var config = {};
		
		config.name		= name;
		config.setUp	= function(){ this.data = setupFn(); };
		config.tearDown	= function(){ delete this.data; };
		
		Y.each(tests, function(expected, testName){
			config['test' + testName.substring(0, 1).toUpperCase() + testName.substring(1)] = function(){
				
				var checkVal = function(val){
					Y.Assert.areEqual(expected, val, testName + ' should be ' + expected);
				};
				
				if (testName.match(/^async.+/)) {
					valueFn(name, testName, this.data, Y.bind(function(val){
						this.resume(Y.bind(checkVal, this, val));
					}, this));
					this.wait(30000);
				} else {
					checkVal(valueFn(name, testName, this.data));
				}
				
			};
		});
		
		return new Y.Test.Case(config);
	};
	
	// *** Namespace *** //
	
	Y.TestUtils = TestUtils;
	
}, '0.1', { requires: ['test'] });
