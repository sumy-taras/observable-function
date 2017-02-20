const wrap = require('../index.js').wrap
const logFunc = require('./common.js').logFunc
const errFunc = require('./common.js').errFunc

let add = wrap((a, b) => a + b)
  .before(() => new Error('my error'))
  .before(logFunc('b1'))
  .after(logFunc('a1'))
  .error(errFunc('e1'))

add(3, 5)