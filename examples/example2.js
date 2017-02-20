const wrap = require('../index.js').wrap
const PropertyError = require('./common.js').PropertyError
const logFunc = require('./common.js').logFunc
const errFunc = require('./common.js').errFunc

const mul10 = e => e * 10


var add = function(a, b) {
  return a + b
}


var wrapped_add = wrap(add)
  .before(p => {
    if (p.length<2) {
      return new PropertyError('arguments', p, 'must be two')
    }
  })
  .error(errFunc('ERROR1: '))
  .error(e => e.values.concat(0))
  .before(logFunc('b1: '))
  .after(logFunc('a1: '))

console.log('----------')
console.log('1. result = ', wrapped_add(2, 7))

console.log('----------')
console.log('2. result = ', wrapped_add(2))


wrapped_add
  .before(a => a.map(mul10))
  .before(logFunc('b2: '))
  .after(mul10)
  .after(logFunc('a2: '))

console.log('----------')
console.log('3. result = ', wrapped_add(4, 3))
