const { wrap } = require('../index')
const { logFunc, errFunc, PropertyError } = require('./common')

const mul10 = e => e * 10

var add = function(a, b) {
  return a + b
}

// we can wrap function and add some validator for arguments and logger for input and output values
var wrapped_add = wrap(add)
  .before(p => (p.length<2) ? new PropertyError('arguments', p, 'must be two') : undefined )
  .error(errFunc('1. error'))
  .before(logFunc('1. before: '))
  .after(logFunc('1. after: '))

console.log('1. result = ', wrapped_add(3, 5))

console.log('2. result = ', wrapped_add(4))

// further we can add error handler which resolve issue with missing some arguments
wrapped_add
  .error(e => e.values.concat(0, 0))

console.log('3. result = ', wrapped_add(4))

// also we can change incoming and outcoming values so that it will be imperceptible
// both for function and for it callers
wrapped_add
  .before(a => a.map(mul10))
  .before(logFunc('2. before: '))
  .after(mul10)
  .after(logFunc('2. after: '))

console.log('4. result = ', wrapped_add(2, 7))

console.log('5. result = ', wrapped_add(2))

console.log('6. result = ', wrapped_add())
