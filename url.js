/**
 * URL.js
 */

var URL = function () {
	
	var u = this;
	
	if (u && u.hasOwnProperty && (u instanceof URL)) {
		u._init.apply(u, arguments);
	} else {
		u = URL.apply(u, arguments);
	}
	
	return u;
};

(function(){
	
	var HTTP_PROTOCOL	= 'http:',
		HTTPS_PROTOCOL	= 'https:',
		SLASH_SLASH		= '//',
		WWW				= 'www',
		AT				= '@',
		DOT				= '.',
		COLON			= ':',
		SLASH			= '/',
		QUESTION		= '?',
		EQUALS			= '=',
		AMP				= '&',
		HASH			= '#',
		EMPTY_STRING	= '',
		
		TRIM_REGEX		= /^\s+|\s+$/g,
		URL_REGEX		= /^(?:(https?:)\/\/)?(?:([^:@\s]+:?[^:@\s]+?)@)?((?:[^;:@=\/\?\.\s]+\.)+[A-Za-z0-9\-]{2,})(?::(\d+))?(?=\/|\?|#|$)([^\?#]+)?(?:\?([^#]+))?(?:#(.+))?/i,
		
		trim, isString;
	
	trim = String.prototype.trim ? function (s) {
		return ( s && s.trim ? s.trim() : s );
	} : function (s) {
		try {
			return s.replace(TRIM_REGEX, EMPTY_STRING);
		} catch (e) { return s; }
	};
	
	isString = function (o) {
		return typeof o === 'string';
	};
	
	// *** Prototype *** //
	
	URL.prototype = {
		
		// *** Lifecycle Methods *** //
		
		_init : function (url) {
			
			var urlParts = URL.parse(url);
			
			if ( ! urlParts) { return; }
			
			this._absolute	= true;
			this._protocol	= urlParts[1] ? urlParts[1].toLowerCase() : HTTP_PROTOCOL;
			this._userInfo	= urlParts[2];
			this._host		= urlParts[3].toLowerCase();
			this._port		= urlParts[4] ? parseInt(urlParts[4], 10) : undefined;
			this._path		= urlParts[5] || SLASH;
			this._query		= URL.parseQuery(urlParts[6]);
			this._fragment	= urlParts[7];
		},
		
		// *** Object Methods *** //
		
		toString : function () {
			
			if ( ! this._absolute) { return EMPTY_STRING; }
			
			return [
			
				this._protocol + SLASH_SLASH,
				this.authority(),
				this._path,
				this.query(),
				this._fragment ? (HASH + this._fragment) : EMPTY_STRING
			
			].join(EMPTY_STRING);
		},
		
		// *** Accessor Methods *** //
		
		protocol : function () {
			
			return this._potocol;
		},
		
		userInfo : function () {
			
			return this._userInfo;
		},
		
		host : function () {
			
			return this._host;
		},
		
		port : function () {
			
			return this._port;
		},
		
		path : function () {
			
			return this._path;
		},
		
		query : function () {
			
			var query = this._query,
				queryString = EMPTY_STRING,
				i, len;
			
			if (query) {
				queryString = QUESTION;
				for (i = 0, len = query.length; i < len; i++) {
					queryString += query[i].join(EQUALS);
					if (i < len - 1) {
						queryString += AMP;
					}
				}
			}
			
			return queryString;
		},
		
		fragment : function () {
			
			return this._fragment;
		},
		
		domain : function () {
			
			return this._host.split(DOT).slice(-2).join(DOT);
		},
		
		authority : function () {
			
			return [
			
				this._userInfo ? (this._userInfo + AT) : EMPTY_STRING,
				this._host,
				this._port ? (COLON + this._port) : EMPTY_STRING,
			
			].join(EMPTY_STRING);
		}
		
		// *** Private Methods *** //
		
	};
	
	// *** Static *** //
	
	URL.parse = function (url) {
		
		if ( ! isString(url)) { return; }
		
		url = trim(url);
		
		return ( url.length > 0 ? url.match(URL_REGEX) : null );
	};
	
	URL.parseQuery = function (queryString) {
		
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
	};
	
}());
