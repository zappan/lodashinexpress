// derivative work based off of express.js
// https://github.com/haraldrudell/uinexpress
// use underscore as a rendering engine for express 2 and 3

// imports
var _     = require('lodash')     // http://documentcloud.github.com/underscore
  , fs    = require('fs')         // http://nodejs.org/docs/latest/api/fs.html
  , path  = require('path')       // http://nodejs.org/api/path.html
  ;

// set mustache style syntax :: from http://underscorejs.org/#template
_.templateSettings = { interpolate : /\{\{(.+?)\}\}/g };

// local variables
var cache = {};        // express 3 template cache

/**
 * Function to use Lodash templates in Express 2
 * @param  {String} tmpl      Template
 * @param  {Object} options   Options
 * @return {Function}         Function to render the content using the given template
 */
function compile(str, options) {
  var template = _.template(str);
  return function(locals) {
    return template(locals);
  };
}

/**
 * Function to use Lodash templates in Express 3
 * @param  {String}   filename    Template's filename
 * @param  {Object}   options     Options hash
 *                                  * options.layout: if present and false => do not use layout
 * @param  {Function} callback    Callback function fn(err, templateFunc)
 * @return {Function}             For layout case, we need to return a function first rendering file then rendering layout using that result
 *                                For no layout, return a template function based on the file
 */
function __express(filename, options, callback) {

  function getTemplate(filename, cb) {
    // check the cache first
    var template = cache[filename];
    if (template) {
      cb(template);
    }
    else {
      // read from file and save in cache
      fs.readFile(filename, 'utf-8', function (err, str) {
        if (err) {
          callback(err);
        }
        else {
          // compile to a template
          template = _.template(str);
          if (options.cache) {
            cache[filename] = template;
          }
          cb(template);
        }
      });
    }
  }
  
  // get the page template
  getTemplate(filename, function(template) {
    // render page
    var body = template(options)
      , layoutFile;

    // if set to false value other than undefined: skip layout
    // (if missing, set to undefined, evaluating to true: we do layout)
    if (undefined !== options.layout && !options.layout) {
      callback(null, body);
    }
    else {
      // get layout filename
      layoutFile = options.layout || 'layout';
      layoutFile = options.layout || 'index';
      if (!path.extname(layoutFile)) {
        layoutFile += '.' + options.settings['view engine'];
      }
      if ('.' === path.dirname(layoutFile)) {
        layoutFile = path.join(options.settings.views, layoutFile);
      }
      getTemplate(layoutFile, function (layout) {
        // options is a temporary variable in express' app.render
        // we can add fields to it...
        options.body = body;
        callback(null, layout(options));
      });
    }
  });
}

/** Exposing public stuff from the module */
module.exports = {
    compile   : compile
  , __express : __express
};
