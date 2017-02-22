const { wrap } = require('../index')
const { logFunc, errFunc, PropertyError } = require('./common')

const checkArgCount = count =>
  p => (p.length<count) ? new PropertyError('arguments', p, `must be ${count}`) : undefined

// we can wrap function and add some validator for arguments and logger for input and output values
let add = wrap((a, b) => a + b)
  .before(checkArgCount(2))
  .before(logFunc('1. before: '))
  .after(logFunc('1. after: '))
  .error(errFunc('1. error'))

console.log('1. result = ', add(3, 5))

console.log('2. result = ', add(4))
