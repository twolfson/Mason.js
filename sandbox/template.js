// Attribution to underscore.js

// By default, Underscore uses ERB-style template delimiters, change the
// following template settings to use alternative delimiters.
var templateSettings = {
  evaluate    : /<%([\s\S]+?)%>/g,
  interpolate : /<%=([\s\S]+?)%>/g,
  escape      : /<%-([\s\S]+?)%>/g
};

// JavaScript micro-templating, similar to John Resig's implementation.
// Underscore templating handles arbitrary delimiters, preserves whitespace,
// and correctly escapes quotes within interpolated code.
define(['Helper'], function (Helper) {
  return function (str, data) {
    var c  = templateSettings;
    var tmpl = 'var __p=[];' +
      '__p.push(\'' +
      str.replace(/\\/g, '\\\\')
         .replace(/'/g, "\\'")
         .replace(c.escape, function(match, code) {
           return "',Helper.escape(" + code.replace(/\\'/g, "'").replace(/\/\/[^\n]+/g, '') + "),'";
         })
         .replace(c.interpolate, function(match, code) {
           return "'," + code.replace(/\\'/g, "'").replace(/\/\/[^\n]+/g, '') + ",'";
         })
         .replace(c.evaluate, function(match, code) {
           return "');" + code.replace(/\\'/g, "'")
                              .replace(/\/\/[^\n]+/g, '')
                              .replace(/[\r\n\t]/g, ' ') + "__p.push('";
         })
         .replace(/\r/g, '\\r')
         .replace(/\n/g, '\\n')
         .replace(/\t/g, '\\t') + "');return __p.join('');";
    
    // Build out key array and value array for Function invocation
    var fnKeys = [],
        fnVals = [],
        key;

    for( key in data ) {
      if( data.hasOwnProperty(key) ) {
        fnKeys[ fnKeys.length ] = key;
        fnVals[ fnVals.length ] = data[key];
      }
    }

    // Add function body
    fnKeys[ fnKeys.length ] = tmpl;
    var fn = Function.apply(function(){}, fnKeys);

    // Execute and callback function
    return fn.apply(fn, fnVals);
  };
});