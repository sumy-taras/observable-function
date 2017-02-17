var wrap = require('./observable-function').wrap

function PropertyError(property, values, message) {
  this.name = 'PropertyError'

  this.property = property
  this.values = values
  this.message = message

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, PropertyError)
  } else {
    this.stack = (new Error()).stack
  }

}
PropertyError.prototype = Object.create(Error.prototype)

var logFunc = message => (...p) => { console.log(message, ...p) }

var errFunc = message => p => {
  if (p instanceof PropertyError) {
    console.warn(`${message} [${p.name}] - ${p.message} ${p.property}`)
    // console.info(message, p.name, p.property, p.message)
  } else {
    console.error(message, p.name, p.message)
  }
}

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
