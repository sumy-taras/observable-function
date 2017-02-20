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

var logFunc = message => args => { console.log(message, args); return args }

var errFunc = message => err => {
  if (err instanceof PropertyError) {
    console.warn(`${message} [${err.name}] - ${err.message} ${err.property}`)
    // console.info(message, err.name, err.property, err.message)
  } else {
    console.error(message, err.name, err.message)
  }
  return err
}

module.exports.PropertyError = PropertyError
module.exports.logFunc = logFunc
module.exports.errFunc = errFunc
