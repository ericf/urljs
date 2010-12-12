/**
 * URL.js
 * 
 * Copyright 2010 Eric Ferraiuolo
 */

var URL = function () {
	
	var u = this;
	
	if ( ! (u && u.hasOwnProperty && (u instanceof URL))) {
		u = new URL();
	}
	
	return u._init.apply(u, arguments);
};

(function(){
	
	var ABSOLUTE		= 'absolute',
		RELATIVE		= 'schemeRelative',
		
		HTTP			= 'http',
		HTTPS			= 'https',
		COLON			= ':',
		SLASH_SLASH		= '//',
		WWW				= 'www',
		AT				= '@',
		DOT				= '.',
		SLASH			= '/',
		QUESTION		= '?',
		EQUALS			= '=',
		AMP				= '&',
		HASH			= '#',
		EMPTY_STRING	= '',
		
		URL_TYPE_REGEX		= /^(?:(https?:\/\/|\/\/)|(\/|\?|#)|[^;:@=\.\s])/i,
		URL_ABSOLUTE_REGEX	= /^(?:(https?)?:?\/\/)?(?:([^:@\s]+:?[^:@\s]+?)@)?((?:[^;:@=\/\?\.\s]+\.)+[A-Za-z0-9\-]{2,})(?::(\d+))?(?=\/|\?|#|$)([^\?#]+)?(?:\?([^#]+))?(?:#(.+))?/i,
		URL_RELATIVE_REGEX	= /^([^\?#]+)?(?:\?([^#]+))?(?:#(.+))?/i,
		
		STRING			= 'string',
		TRIM_REGEX		= /^\s+|\s+$/g,
		
		trim, isString;
	
	// *** Utilities *** //
	
	trim = String.prototype.trim ? function (s) {
		return ( s && s.trim ? s.trim() : s );
	} : function (s) {
		try {
			return s.replace(TRIM_REGEX, EMPTY_STRING);
		} catch (e) { return s; }
	};
	
	isString = function (o) {
		return typeof o === STRING;
	};
	
	// *** Static *** //
	
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
	
	URL.ABSOLUTE	= ABSOLUTE;
	URL.RELATIVE	= RELATIVE;
	
	URL.parseQuery		= parseQuery;
	
	// *** Prototype *** //
	
	URL.prototype = {
		
		// *** Lifecycle Methods *** //
		
		_init : function (url) {
			
			url = trim(url);
			
			this._isValid = isString(url) && url.length > 0 && this._parse(url);
			
			return this;
		},
		
		// *** Object Methods *** //
		
		toString : function () {
			
			if ( ! this._isValid) { return EMPTY_STRING; }
			
			var s = [];
			
			if (this._type === ABSOLUTE) {
				s.push(
					this._scheme ? (this._scheme + COLON + SLASH_SLASH) : SLASH_SLASH,
					this.authority()
				);
			}
			
			s.push(
				this._path,
				this._query ? (QUESTION + this.query()) : EMPTY_STRING,
				this._fragment ? (HASH + this._fragment) : EMPTY_STRING
			);
			
			return s.join(EMPTY_STRING);
		},
		
		// *** Accessor Methods *** //
		
		isAbsolute : function () {
			
			return this._type === ABSOLUTE;
		},
		
		isValid : function () {
			
			return this._isValid;
		},
		
		type : function () {
			
			return this._type;
		},
		
		scheme : function () {
			
			return this._scheme;
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
		},
		
		// *** Private Methods *** //
		
		_parse : function (url, type) {
			
			if ( ! type) {
				type = url.match(URL_TYPE_REGEX);
				type = type ? type[1] ? ABSOLUTE : type[2] ? RELATIVE : null : null;
			}
			
			var urlParts;
			
			switch (type) {
				
				case ABSOLUTE:
					urlParts = url.match(URL_ABSOLUTE_REGEX);
					if (urlParts) {
						this._type		= ABSOLUTE;
						this._scheme	= urlParts[1] ? urlParts[1].toLowerCase() : url.indexOf(SLASH_SLASH) !== 0 ? HTTP : undefined;
						this._userInfo	= urlParts[2];
						this._host		= urlParts[3].toLowerCase();
						this._port		= urlParts[4] ? parseInt(urlParts[4], 10) : undefined;
						this._path		= urlParts[5] || SLASH;
						this._query		= parseQuery(urlParts[6]);
						this._fragment	= urlParts[7];
					}
					break;
					
				case RELATIVE:
					urlParts = url.match(URL_RELATIVE_REGEX);
					if (urlParts) {
						this._type		= RELATIVE;
						this._path		= urlParts[5];
						this._query		= parseQuery(urlParts[6]);
						this._fragment	= urlParts[7];
					}
					break;
					
				default:
					return ( this._parse(url, ABSOLUTE) || this._parse(url, RELATIVE) );
				
			}
			
			return ( urlParts ? true : false );
		}
		
	};
	
}());
