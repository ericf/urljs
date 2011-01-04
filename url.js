/**
 * URL.js
 * 
 * Copyright 2011 Eric Ferraiuolo
 */

/**
 * URL constructor and utility.
 * Provides support for validating whether something is a URL,
 * formats and cleans up URL-like inputs into something nice and pretty,
 * ability to resolve one URL against another and returned the formatted result,
 * and is a convenient API for working with URL Objects and the various parts of URLs.
 * 
 * @constructor	URL
 * @param		{String | Object | URL}	url	- the URL String, parsed URL Object, or URL instance to base the URL instance from
 * @return		{URL}					url - instance of a URL all nice and parsed
 */
var URL = function () {
	
	var u = this;
	
	if ( ! (u && u.hasOwnProperty && (u instanceof URL))) {
		u = new URL();
	}
	
	return u._init.apply(u, arguments);
};

(function(){
	
	var ABSOLUTE			= 'absolute',
		RELATIVE			= 'relative',
		
		HTTP				= 'http',
		HTTPS				= 'https',
		COLON				= ':',
		SLASH_SLASH			= '//',
		WWW					= 'www',
		AT					= '@',
		DOT					= '.',
		SLASH				= '/',
		DOT_DOT				= '..',
		DOT_DOT_SLASH		= '../',
		QUESTION			= '?',
		EQUALS				= '=',
		AMP					= '&',
		HASH				= '#',
		EMPTY_STRING		= '',
		
		TYPE				= 'type',
		SCHEME				= 'scheme',
		USER_INFO			= 'userInfo',
		HOST				= 'host',
		PORT				= 'port',
		PATH				= 'path',
		QUERY				= 'query',
		FRAGMENT			= 'fragment',
		
		URL_TYPE_REGEX		= /^(?:(https?:\/\/|\/\/)|(\/|\?|#)|[^;:@=\.\s])/i,
		URL_ABSOLUTE_REGEX	= /^(?:(https?)?:?\/\/)?(?:([^:@\s]+:?[^:@\s]+?)@)?((?:[^;:@=\/\?\.\s]+\.)+[A-Za-z0-9\-]{2,})(?::(\d+))?(?=\/|\?|#|$)([^\?#]+)?(?:\?([^#]+))?(?:#(.+))?/i,
		URL_RELATIVE_REGEX	= /^([^\?#]+)?(?:\?([^#]+))?(?:#(.+))?/i,
		
		OBJECT				= 'object',
		STRING				= 'string',
		TRIM_REGEX			= /^\s+|\s+$/g,
		
		trim, isString;
	
	// *** Utilities *** //
	
	trim = String.prototype.trim ? function (s) {
		return ( s && s.trim ? s.trim() : s );
	} : function (s) {
		try {
			return s.replace(TRIM_REGEX, EMPTY_STRING);
		} catch (e) { return s; }
	};
	
	isObject = function (o) {
		return ( o && typeof o === OBJECT );
	}
	
	isString = function (o) {
		return typeof o === STRING;
	};
	
	// *** Static *** //
	
	/**
	 * Parses a URL into usable parts.
	 * Reasonable defaults are applied to parts of the URL which weren't present in the input,
	 * e.g. 'example.com' -> { type: 'absolute', scheme: 'http', host: 'example.com', path: '/' }
	 * If nothing or a falsy value is returned the URL wasn't something valid,
	 * usable, or that seems reasonably like a URL.
	 * 
	 * @static
	 * @method	parse
	 * @param	{String}	url			- the URL string to parse
	 * @param	{String}	type		- URL.ABSOLUTE or URL.RELATIVE seeds the parsing style
	 * @return	{Object}	parsedURL	- an Object representing the parts of the URL
	 * 									contains the keys: type, scheme, userInfo, host, port, path, query, fragment
	 */
	function parse (url, type) {
		
		// make sure we have a good string
		url = trim(url);
		if ( ! (isString(url) && url.length > 0)) {
			return;
		}
		
		// figure out type, absolute or relative, if not provided
		if ( ! type) {
			type = url.match(URL_TYPE_REGEX);
			type = type ? type[1] ? ABSOLUTE : type[2] ? RELATIVE : null : null;
		}
		
		var parsedURL, urlParts;
		
		switch (type) {
			
			// parse as absolute URL
			case ABSOLUTE:
				urlParts = url.match(URL_ABSOLUTE_REGEX);
				if (urlParts) {
					parsedURL				= {};
					parsedURL[TYPE]			= ABSOLUTE;
					parsedURL[SCHEME]		= urlParts[1] ? urlParts[1].toLowerCase() : url.indexOf(SLASH_SLASH) !== 0 ? HTTP : undefined;
					parsedURL[USER_INFO]	= urlParts[2];
					parsedURL[HOST]			= urlParts[3].toLowerCase();
					parsedURL[PORT]			= urlParts[4] ? parseInt(urlParts[4], 10) : undefined;
					parsedURL[PATH]			= urlParts[5] || SLASH;
					parsedURL[QUERY]		= parseQuery(urlParts[6]);
					parsedURL[FRAGMENT]		= urlParts[7];
				}
				break;
			
			// parse as relative URL
			case RELATIVE:
				urlParts = url.match(URL_RELATIVE_REGEX);
				if (urlParts) {
					parsedURL			= {};
					parsedURL[TYPE]		= RELATIVE;
					parsedURL[PATH]		= urlParts[1];
					parsedURL[QUERY]	= parseQuery(urlParts[2]);
					parsedURL[FRAGMENT]	= urlParts[3];
				}
				break;
			
			// try to parse as absolute first, then relative if that fails
			default:
				return ( parse(url, ABSOLUTE) || parse(url, RELATIVE) );
			
		}
		
		return parsedURL;
	}
	
	/**
	 * Helper to parse a URL query string into an array of arrays.
	 * Order of the query paramerters is maintained, an example structure would be:
	 * queryString: 'foo=bar&baz' -> [['foo', 'bar'], ['baz']]
	 * 
	 * @static
	 * @method	parseQuery
	 * @param	{String}	queryString	- the query string to parse, should not include '?'
	 * @return	{Array}		parsedQuery	- array of arrays representing the query parameters and values
	 */
	function parseQuery (queryString) {
		
		if ( ! isString(queryString)) { return; }
		
		queryString = trim(queryString);
		
		var query		= [],
			queryParts	= queryString.split(AMP),
			queryPart, i, len;
		
		for (i = 0, len = queryParts.length; i < len; i++) {
			if (queryParts[i]) {
				queryPart = queryParts[i].split(EQUALS);
				query.push(queryPart[1] ? queryPart : [queryPart[0]]);
			}
		}
		
		return query;
	}
	
	/**
	 * Formats a URL String, parsed URL Object, or URL instance into a nice clean URL String.
	 * Relative URLs will remain relative, scheme-relative (//) URLs remain scheme-relative.
	 * 
	 * @static
	 * @method	format
	 * @param	{String | Object | URL}	url				- the URL String, parsed URL Object, or URL instance to format
	 * @return	{String}				formattedURL	- the clean formatted URL String
	 */
	function format (url) {
		
		if (url instanceof URL) { return url.toString(); }
		
		url = isString(url) ? parse(url) : url;
		
		if ( ! url) { return EMPTY_STRING; }
		
		var formattedURL	= [],
			type			= url[TYPE],
			scheme			= url[SCHEME],
			userInfo		= url[USER_INFO],
			host			= url[HOST],
			port			= url[PORT],
			path			= url[PATH],
			query			= url[QUERY],
			fragment		= url[FRAGMENT];
		
		if (type === ABSOLUTE) {
			formattedURL.push(
				scheme ? (scheme + COLON + SLASH_SLASH) : SLASH_SLASH,
				userInfo ? (userInfo + AT) : EMPTY_STRING,
				host,
				port ? (COLON + port) : EMPTY_STRING
			);
		}
		
		formattedURL.push(
			path,
			query ? (QUESTION + formatQuery(query)) : EMPTY_STRING,
			fragment ? (HASH + fragment) : EMPTY_STRING
		);
		
		return formattedURL.join(EMPTY_STRING);
	}
	
	/**
	 * Helper to format a parsed query array of arrays into a query String.
	 * This method tries to be smart an doesn't leave trailing '=' or '&'.
	 * 
	 * @static
	 * @method	formatQuery
	 * @param	{Array}		parsedQuery	- array of arrays representing the parsed query parameters and values
	 * @return	{String}	queryString	- the formatted query string, does not include '?'
	 */
	function formatQuery (query) {
		
		var queryString = EMPTY_STRING,
			i, len;
		
		if (query) {
			for (i = 0, len = query.length; i < len; i++) {
				queryString += query[i].join(EQUALS);
				if (i < len - 1) {
					queryString += AMP;
				}
			}
		}
		
		return queryString;
	}
	
	/**
	 * Returns a resolved URL String using the baseUrl to resolve the url against.
	 * This attempts to resolve URLs like a browser would on a web page.
	 * 
	 * @static
	 * @method	resolve
	 * @param	{String | Object | URL}	baseUrl			- the URL String, parsed URL Object, or URL instance as the resolving base
	 * @param	{String | Object | URL}	url				- the URL String, parsed URL Object, or URL instance to resolve
	 * @return	{String}				resolvedUrl		- a resolved URL String
	 */
	function resolve (baseUrl, url) {
		
		baseUrl	= (baseUrl instanceof URL) ? baseUrl : URL(baseUrl);
		url		= (url instanceof URL) ? url : URL(url);
		
		var resolvedURL, path, pathParts, pathStack, i, len;
		
		if ( ! (baseUrl.isValid() && url.isValid())) { return; }
		
		// base better be absolute, otherwise this is weird!
		
		if (baseUrl.isAbsolute()) {
			
			if (url.isAbsolute()) {
				if (baseUrl.authority() === url.authority()) {
					return URL(url).scheme(baseUrl.scheme()).toString();
				} else {
					return url.toString();
				}
			}
			
			// url isn't absolute
			
			resolvedURL	= URL(baseUrl);
			
			if (url.path()) {
				
				if (url.path().indexOf(SLASH) === 0) {
					path = url.path();
				} else {
					path = baseUrl.path().substring(0, baseUrl.path().lastIndexOf(SLASH) + 1) + url.path();
				}
				
				// normalize ../'s
				if (path.indexOf(DOT_DOT_SLASH) > -1) {
					pathParts = path.split(SLASH);
					pathStack = [];
					for ( i = 0, len = pathParts.length; i < len; i++ ) {
						if (pathParts[i] === DOT_DOT 
							&& pathStack.length > 0
							&& pathStack[pathStack.length - 1] !== DOT_DOT) {
							pathStack.pop();
						} else {
							pathStack.push(pathParts[i]);
						}
					}
					path = pathStack.join(SLASH);
					
					if (url.path().indexOf(url.path().length) === SLASH) {
						path += SLASH;
					}
				}
				
				resolvedURL.path(path).query(url.query()).fragment(url.fragment());
				
			} else if (url.query()) {
				resolvedURL.query(url.query()).fragment(url.fragment());
			} else if (url.fragment()) {
				resolvedURL.fragment(url.fragment());
			}
			
			return resolvedURL.toString();
			
		}
	}
	
	URL.ABSOLUTE	= ABSOLUTE;
	URL.RELATIVE	= RELATIVE;
	
	URL.parse		= parse;
	URL.parseQuery	= parseQuery;
	URL.format		= format;
	URL.formatQuery	= formatQuery;
	URL.resolve		= resolve;
	
	// *** Prototype *** //
	
	URL.prototype = {
		
		// *** Lifecycle Methods *** //
		
		/**
		 * Initializes a new URL instance, or re-initializes an existing one.
		 * The URL constructor delegates to this method to do the initializing,
		 * and the mutator instance methods call this to re-initialize when something changes.
		 * 
		 * @private
		 * @method	init
		 * @param	{String | Object | URL}	url	- the URL String, parsed URL Object, or URL instance to base the URL instance from
 		 * @return	{URL}					url - instance of a URL all nice and parsed/re-parsed
		 */
		_init : function (url) {
			
			url = isString(url) ? url : url instanceof URL ? url.toString() : isObject(url) ? format(url) : null;
				
			var parsedURL	= url ? parse(url) : null;
			this._isValid	= parsedURL ? true : false;
			this._url		= parsedURL || this._url || {};
			
			return this;
		},
		
		// *** Object Methods *** //
		
		/**
		 * Returns the formatted URL String.
		 * Overridden Object toString method to do something useful.
		 * 
		 * @public
		 * @method	toString
		 * @return	{String}	url	- formatted URL string
		 */
		toString : function () {
			
			return format(this._url);
		},
		
		// *** Accessor/Mutator Methods *** //
		
		/**
		 * Whether parsing from initialization or re-initialization produced something valid.
		 * 
		 * @public
		 * @method	isValid
		 * @return	{Boolean}	valid	- whether the URL is valid
		 */
		isValid : function () {
			
			return this._isValid;
		},
		
		/**
		 * URL is absolute if it has a scheme or is scheme-relative (//).
		 * 
		 * @public
		 * @method	isAbsolute
		 * @return	{Boolean}	absolute	- whether the URL is absolute
		 */
		isAbsolute : function () {
			
			return this._url[TYPE] === ABSOLUTE;
		},
		
		/**
		 * URL is relative if it host or path relative, i.e. doesn't contain a host.
		 * 
		 * @public
		 * @method	isRelative
		 * @return	{Boolean}	relative	- whether the URL is relative
		 */
		isRelative : function () {
			
			return this._url[TYPE] === RELATIVE;
		},
		
		/**
		 * Returns the type of the URL, either: URL.ABSOLUTE or URL.RELATIVE.
		 * 
		 * @public
		 * @method	type
		 * @return	{String}	type	- the type of the URL: URL.ABSOLUTE or URL.RELATIVE
		 */
		type : function () {
			
			return this._url[TYPE];
		},
		
		/**
		 * Returns or sets the scheme of the URL.
		 * If URL is determined to be absolute (i.e. contains a host) and no scheme is provided,
		 * the scheme will default to http.
		 * 
		 * @public
		 * @method	scheme
		 * @param	{String}		scheme	- Optional scheme to set on the URL
		 * @return	{String | URL}	the URL scheme or the URL instance
		 */
		scheme : function (scheme) {
			
			var url = this._url;
			
			if (arguments.length) {
				url[TYPE] = ABSOLUTE;
				url[SCHEME] = scheme;
				return this._init(this);
			} else {
				return url[SCHEME];
			}
		},
		
		/**
		 * Returns or set the user info of the URL.
		 * The user info can optionally contain a password and is only valid for absolute URLs.
		 * 
		 * @public
		 * @method	userInfo
		 * @param	{String}		userInfo	- Optional userInfo to set on the URL
		 * @return	{String | URL}	the URL userInfo or the URL instance
		 */
		userInfo : function (userInfo) {
			
			var url = this._url;
			
			if (arguments.length) {
				url[TYPE] = ABSOLUTE;
				url[USER_INFO] = userInfo;
				return this._init(this);
			} else {
				return url[USER_INFO];
			}
		},
		
		/**
		 * Returns or sets the host of the URL.
		 * The host name, if set, must be something valid otherwise the URL will become invalid.
		 * 
		 * @public
		 * @method	host
		 * @param	{String}		host	- Optional host to set on the URL
		 * @return	{String | URL}	the URL host or the URL instance
		 */
		host : function (host) {
			
			var url = this._url;
			
			if (arguments.length) {
				url[TYPE] = ABSOLUTE;
				url[HOST] = host;
				return this._init(this);
			} else {
				return url[HOST];
			}
		},
		
		/**
		 * Returns the URL's domain, where the domain is the TLD and SLD of the host.
		 * e.g. foo.example.com -> example.com
		 * 
		 * @public
		 * @method	domain
		 * @return	{String}	domain	- the URL domain
		 */
		domain : function () {
			
			var host = this._url[HOST];
			
			return ( host ? host.split(DOT).slice(-2).join(DOT) : undefined );
		},
		
		/**
		 * Returns or sets the port of the URL.
		 * 
		 * @public
		 * @method	port
		 * @param	{Number}		port	- Optional port to set on the URL
		 * @return	{Number | URL}	the URL port or the URL instance
		 */
		port : function (port) {
			
			var url = this._url;
			
			if (arguments.length) {
				url[TYPE] = ABSOLUTE;
				url[PORT] = port;
				return this._init(this);
			} else {
				return url[PORT];
			}
		},
		
		/**
		 * Returns the URL's authority which is the userInfo, host, and port combined.
		 * This only makes sense for absolute URLs
		 * 
		 * @public
		 * @method	authority
		 * @return	{String}	authority	- the URL's authority (userInfo, host, and port)
		 */
		authority : function () {
			
			var url			= this._url,
				userInfo	= url[USER_INFO],
				host		= url[HOST],
				port		= url[PORT];
			
			return [
			
				userInfo ? (userInfo + AT) : EMPTY_STRING,
				host,
				port ? (COLON + port) : EMPTY_STRING,
			
			].join(EMPTY_STRING);
		},
		
		/**
		 * Returns or sets the path of the URL.
		 * 
		 * @public
		 * @method	path
		 * @param	{String}		path	- Optional path to set on the URL
		 * @return	{String | URL}	the URL path or the URL instance
		 */
		path : function (path) {
			
			if (arguments.length) {
				this._url[PATH] = path;
				return this._init(this);
			} else {
				return this._url[PATH];
			}
		},
		
		/**
		 * Returns or sets the query of the URL.
		 * This takes or returns the parsed query as an Array of Arrays.
		 * 
		 * @public
		 * @method	query
		 * @param	{Array}			query	- Optional query to set on the URL
		 * @return	{Array | URL}	the URL query or the URL instance
		 */
		query : function (query) {
			
			if (arguments.length) {
				this._url[QUERY] = query;
				return this._init(this);
			} else {
				return this._url[QUERY];
			}
		},
		
		/**
		 * Returns or sets the query of the URL.
		 * This takes or returns the query as a String; doesn't include the '?'
		 * 
		 * @public
		 * @method	queryString
		 * @param	{String}		queryString	- Optional queryString to set on the URL
		 * @return	{String | URL}	the URL queryString or the URL instance
		 */
		queryString : function (queryString) {
			
			if (arguments.length) {
				this._url[QUERY] = parseQuery(queryString);
				return this._init(this);
			} else {
				return formatQuery(this._url[QUERY]);
			}
		},
		
		/**
		 * Returns or sets the fragment on the URL.
		 * The fragment does not contain the '#'.
		 * 
		 * @public
		 * @method	fragment
		 * @param	{String}		fragment	- Optional fragment to set on the URL
		 * @return	{String | URL}	the URL fragment or the URL instance
		 */
		fragment : function (fragment) {
			
			if (arguments.length) {
				this._url[FRAGMENT] = fragment;
				return this._init(this);
			} else {
				return this._url[FRAGMENT];
			}
		},
		
		/**
		 * Returns the formatted URL String.
		 * This is an alias for toString, provided for API completeness with the static utility methods.
		 * 
		 * @public
		 * @method	format
		 * @alias	toString
		 * @return	{String}	url	- formatted URL string	
		 */
		format : function () {
			
			return this.toString();
		},
		
		/**
		 * Returns a new, resolved URL instance using this as the baseUrl.
		 * The URL passed in will be resolved against the baseUrl.
		 * 
		 * @public
		 * @method	resolve
		 * @param	{String | Object | URL}	url	- the URL String, parsed URL Object, or URL instance to resolve
 		 * @return	{URL}					url - a resolved URL instance
		 */
		resolve : function (url) {
			
			return URL(resolve(this, url));
		}
				
		// *** Private Methods *** //
		
	};
	
}());
