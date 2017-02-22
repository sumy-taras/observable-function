# observable-function

This module has wrapper which makes any function to observable and allows to control the params passed to function and the result of performing.


## Install

> Install with [npm](https://www.npmjs.com/)

```bash
$ npm install observable-function
```


## Usage

> For more use-cases try [examples](./examples)

We can wrap function and add validators for arguments and logger for input and output values:
```javascript
const { wrap } = require('observable-function')
const { logFunc, errFunc, PropertyError } = require('./common')

const checkArgCount = count =>
  p => (p.length<count) ? new PropertyError('arguments', p, `must be ${count}`) : undefined

let add = wrap((a, b) => a + b)
  .before(checkArgCount(2))
  .before(logFunc('1. before: '))
  .after(logFunc('1. after: '))
  .error(errFunc('1. error'))

console.log('1. result = ', add(3, 5))

console.log('2. result = ', add(4))
```
Further we can add error handler which resolve issue with missing some arguments:
```javascript
add.error(e => e.values.concat(0, 0))

console.log('3. result = ', add(4))
```
Also we can change incoming and outcoming values so that it will be imperceptible both for initial function and for it callers:
```javascript
add
  .before(a => a.map(mul10))
  .before(logFunc('2. before: '))
  .after(mul10)
  .after(logFunc('2. after: '))

console.log('4. result = ', add(2, 7))

console.log('5. result = ', add(2))

console.log('6. result = ', add())
```
although it is desirable to do like this in rare special cases.

## API

> Supported chainable notation. Handlers may be several.
> Each handler receive one argument (*array*) and could return the result which will be used as argument for next handler (or wrapped function). If the type of returned value is Error then will be invoked sequentially all error handlers. If the error is processed and returned another value (not error) then processing will continue.

### before(*function*)

> Attach function which will be called before wrapped function

```javascript
const checkArgCount = count =>
  p => (p.length<count) ? new PropertyError('arguments', p, `must be ${count}`) : undefined

let add = wrap((a, b) => a + b)

add.before(checkArgCount(2))
```

### after(*function*)

> Attach function which will be called after wrapped function

```javascript
const logFunc = message => args => { console.log(message, args); return args }

let add = wrap((a, b) => a + b)

add.after(logFunc('1. after: '))
```

### error(*function*)

> Attach error handler

```javascript
const errFunc = message => err => {
  if (err instanceof PropertyError) {
    console.warn(`${message} [${err.name}] - ${err.message} ${err.property}`)
  } else {
    console.error(message, err.name, err.message)
  }
  return err
}

let add = wrap((a, b) => a + b)

add.error(errFunc('1. error'))
```

## License

MIT © [Taras Panasyuk](sumy.taras@gmail.com)
