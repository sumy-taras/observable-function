const { wrap } = require('../index')
const { logFunc, errFunc, PropertyError } = require('./common')

const mul10 = e => e * 10;

const checkArgCount = count =>
  p => (p.length < count) ? new PropertyError('arguments', p, `must be ${count}`) : undefined

// we can wrap function and add some validator for arguments and logger for input and output values
const add = wrap((a, b) => a + b)
  .before(checkArgCount(2))
  .before(logFunc('before: '))
  .after(logFunc('after: '))
  .berror(errFunc('berror: '))
  .error(errFunc('error: '))

console.log('1. result = ', add(3, 5))

console.log('2. result = ', add(4))

// further we can add error handler (invoked before main function) which resolve issue with missing some arguments
const increaseArgsCount = e => (e.property === 'arguments') ? e.values.concat(0, 0) : e

add
  .berror(increaseArgsCount)

console.log('3. result = ', add(4))

// also we can clone wrapper and change incoming and outcoming values
// so that it will be imperceptible both for initial function and for it callers
const cloned_add = add.clone()
  .before(a => a.map(mul10))
  .before(logFunc('_before: '))
  .after(mul10)
  .after(logFunc('_after: '))

console.log('4. result = ', cloned_add(8, 7))

console.log('5. result = ', cloned_add(2))

console.log('6. result = ', cloned_add())

// if you pass new function as argument of clone method then we get a new wrapper with another kernel function
const cloned_subtract = add.clone((a, b) => a - b)

console.log('7. result = ', cloned_subtract(10, 9))

console.log('8. result = ', cloned_subtract(6))
