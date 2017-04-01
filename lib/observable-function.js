(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

function arrayPassEach(array, iteratee, initAccum, isReverse) {
  var i = array.length;
  var maxIndex = array.length - 1;
  var accumulator = initAccum;
  while (i-- && !(accumulator instanceof Error)) {
    var index = isReverse ? i : maxIndex - i;
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

module.exports = arrayPassEach;
},{}],2:[function(require,module,exports){
'use strict';

var stub = function stub() {
  return undefined;
}; //void 0

var transferr = function transferr() {
  for (var _len = arguments.length, p = Array(_len), _key = 0; _key < _len; _key++) {
    p[_key] = arguments[_key];
  }

  return p;
};

var holderr = function holderr() {
  for (var _len2 = arguments.length, p = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    p[_key2] = arguments[_key2];
  }

  return function () {
    return p;
  };
};

var transfer = function transfer(p) {
  return p;
};

var holder = function holder(p) {
  return function () {
    return p;
  };
};

var casts = function casts(b) {
  return typeof b === 'function' ? b : b === undefined ? transfer : holder(b);
};

module.exports = {
  stub: stub,
  transfer: transfer,
  holder: holder,
  transferr: transferr,
  holderr: holderr,
  casts: casts
};
},{}],3:[function(require,module,exports){
'use strict';

var _require = require('./wrap'),
    wrap = _require.wrap;

var _require2 = require('./handy'),
    stub = _require2.stub,
    transfer = _require2.transfer,
    holder = _require2.holder,
    transferr = _require2.transferr,
    holderr = _require2.holderr,
    casts = _require2.casts;

module.exports = {
  wrap: wrap,

  stub: stub,
  transfer: transfer,
  holder: holder,
  transferr: transferr,
  holderr: holderr,
  casts: casts
};
},{"./handy":2,"./wrap":4}],4:[function(require,module,exports){
'use strict';

var arrayPassEach = require('./array-pass-each');

var _require = require('./handy'),
    holder = _require.holder,
    casts = _require.casts;

var pushIfFunc = function pushIfFunc(a, e) {
  return !(typeof e === 'function') || a.push(e);
};

var treatErrorOrUndefined = function treatErrorOrUndefined(a, efunc, u) {
  return a instanceof Error ? efunc(a) : a === undefined ? u : a;
};

var doErrorFunc = function doErrorFunc(e) {
  return function (a, func) {
    return treatErrorOrUndefined(func(e), holder(a), a);
  };
};

var doFunc = function doFunc(errHandler) {
  return function (a, func) {
    return treatErrorOrUndefined(func(a), errHandler, a);
  };
};

var wrap = function wrap(obj) {

  var pre = [];
  var post = [];
  var berr = [];
  var err = [];
  var self = {};

  var wrapper = function wrapper() {
    self = this;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return doAfter(doKernel(doBefore(args)));
  };

  var doMainFunc = function doMainFunc(errHandler) {
    return function (a, func) {
      return treatErrorOrUndefined(func.apply(self, a), errHandler, undefined);
    };
  };
  var doKernel = function doKernel(params) {
    return arrayPassEach([casts(obj)], doMainFunc(doError), params);
  };
  var doBefore = function doBefore(params) {
    return arrayPassEach(pre, doFunc(doBError), params, true);
  };
  var doAfter = function doAfter(params) {
    return arrayPassEach(post, doFunc(doError), params);
  };

  // TODO: implement fastReduce() method for Array
  var doBError = function doBError(params) {
    return berr.reduce(doErrorFunc(params), params);
  };
  var doError = function doError(params) {
    return err.reduce(doErrorFunc(params), params);
  };

  var storeFunc = function storeFunc(a) {
    return function (e) {
      return pushIfFunc(a, e) && wrapper;
    };
  };

  var clone = function clone(kernel) {
    var replica = wrap(kernel !== undefined ? kernel : obj);
    pre.forEach(function (el) {
      return replica.before(el);
    });
    post.forEach(function (el) {
      return replica.after(el);
    });
    berr.forEach(function (el) {
      return replica.berror(el);
    });
    err.forEach(function (el) {
      return replica.error(el);
    });
    return replica;
  };

  wrapper.before = storeFunc(pre);
  wrapper.after = storeFunc(post);
  wrapper.berror = storeFunc(berr);
  wrapper.error = storeFunc(err);
  wrapper.clone = clone;

  return wrapper;
};

module.exports = { wrap: wrap };
},{"./array-pass-each":1,"./handy":2}]},{},[3]);
