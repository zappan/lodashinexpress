# lodashexpress

Enables lodash templates in express versions 2 and 3.

Derivative work based off of [uinexpress](https://github.com/haraldrudell/uinexpress) library
that enables using underscore as a rendering engine for express.js

# Usage

in your express app.js, for express 3:

    app.configure(function () {
      app.engine('html', require('lodashexpress').__express)
      app.set('view engine', 'html')
    });

in your express app.js, for express 2:

    app.configure(function () {
      app.register('html', require('lodashexpress'))
      app.set('view engine', 'html')
    });


# Notes

* An alternative is to use ejs in the browser, see the module [ejsinbrowser](https://github.com/haraldrudell/ejsinbrowser)
* Original project used as a reference: [uinexpress](https://github.com/haraldrudell/uinexpress)
