URL.js
======

**An API for working with URLs in JavaScript.**
URL.js can be used in both **server-side** and **client-side** JavaScript environments,
it has **no dependencies** on any other libraries, and is easy to use for common URL-related tasks.

Design & Approach
-----------------

I had some very specific URL-related programming tasks I needed to do:
validate and normalize user input of URLs and URL-like strings within the browser,
and resolve URLs against each other on the server (in a YQL table to be specific).
Both of these tasks require a very good URL parser, so URL.js centers around parsing.
The design of the API and features of URL.js center around these four main concepts:

* Parsing
* Normalization
* Resolving
* Mutating/Building

**`URL` is both a namespace for utility methods and a constructor/factory to create instances of URL Objects.**

The static utility methods make it convenient when you just want to work with Strings since they return Strings.
When you want to retain a reference to a parsed URL you can easily create a URL instance;
these instances have useful methods, most serve as both an accessor/mutator to a specific part of the URL.

**Currently URL.js only works with HTTP URLs**, albiet the most popular type of URL; 
I have plans to extend the functionality to include support [for all URL schemes](http://www.w3.org/Addressing/URL/url-spec.txt).
Internal to the library is the distiction between absolute and relative URLs.
Absolute URLs are ones which contain a scheme or are scheme-relative, and contain a host.
Relative URLs have slightly looser contraints but the relavence is maintained, either host- or path- relative.

Usage
-----

**`URL` is both a namespace for utility methods and a constructor/factory to create instances of URL Objects.**

### Using Static Utilites

There are two static methods: `normalize` and `resolve`

#### `URL.normalize`:

Takes in a dirty URL and makes it nice and clean.

    URL.normalize('Http://Example.com');          // http://example.com/
    URL.normalize('Http://Example.com?foo=#bar'); // http://example.com/?foo#bar

#### `URL.resolve`:

Given a base URL, this will resolve another URL against it; this method is inspired by what browsers do.
Normalizing is part of resolving, so a normalized and resolved URL String is returned.

    URL.resolve('http://example.com/foo/bar', 'baz/index.html');        // http://example.com/foo/baz/index.html
    URL.resolve('https://example.com/foo/, '//example.com/bar.css');    // https://example.com/bar.css
    URL.resolve('http://example.com/foo/bar/zee/', '../../crazy#whoa'); // http://example.com/foo/crazy#whoa
