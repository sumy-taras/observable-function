# observable-function

Wraps the function and makes it observable what allows to control the params passed to function and the result of performing.

## Install

> Install on Node.JS with [npm](https://www.npmjs.com/)

```bash
$ npm install observable-function
```

> Install for the browser

This package include a build [observable-function.js](./lib/observable-function.js) ready for the browser as well as it minified version [observable-function.min.js](./lib/observable-function.min.js).
Also you can use [Browserify](https://github.com/substack/node-browserify) to organize your browser code and load modules installed by npm.

## Usage

> For more use-cases try [examples](./examples)

Just required function **wrap** from module:
```javascript
const { wrap } = require('observable-function')
```
Then we can wrap function and add some validator for arguments and logger for input and output values:
```javascript
const { logFunc, errFunc, PropertyError } = require('./common')

const mul10 = e => e * 10;
const checkArgCount = count =>
  p => (p.length < count) ? new PropertyError('arguments', p, `must be ${count}`) : undefined

const add = wrap((a, b) => a + b)
  .before(checkArgCount(2))
  .before(logFunc('before: '))
  .after(logFunc('after: '))
  .berror(errFunc('berror: '))
  .error(errFunc('error: '))

console.log('1. result = ', add(3, 5))

console.log('2. result = ', add(4))
```
Further we can add error handler (invoked before main function) which resolve issue with missing some arguments:
```javascript
add
  .berror(increaseArgsCount)

console.log('3. result = ', add(4))
```
Also we can clone wrapper and change incoming and outcoming values so that it will be imperceptible both for initial function and for it callers:
```javascript
const cloned_add = add.clone()
  .before(a => a.map(mul10))
  .before(logFunc('2. before: '))
  .after(mul10)
  .after(logFunc('2. after: '))

console.log('4. result = ', cloned_add(8, 7))

console.log('5. result = ', cloned_add(2))

console.log('6. result = ', cloned_add())
```
If you pass new function as argument of clone method then we get a new wrapper with another kernel function.
```javascript
const cloned_subtract = add.clone((a, b) => a - b)

console.log('7. result = ', cloned_subtract(10, 9))

console.log('8. result = ', cloned_subtract(6))
```

## API

> Supported chainable notation. Handlers may be several.
> Each handler receive one argument (*array*) and could return the result which will be used as argument for next handler (or wrapped function). If the type of returned value is Error then will be invoked sequentially all error handlers. If the error is processed and returned another value (not error) then processing will continue.

### before(*function*)

> Attach function which will be called before wrapped function.

```javascript
const checkArgCount = count =>
  p => (p.length<count) ? new PropertyError('arguments', p, `must be ${count}`) : undefined

let add = wrap((a, b) => a + b)

add.before(checkArgCount(2))
```

### after(*function*)

> Attach function which will be called after wrapped function.

```javascript
const logFunc = message => args => { console.log(message, args); return args }

let add = wrap((a, b) => a + b)

add.after(logFunc('1. after: '))
```

### berror(*function*)

> Attach an error handler to which will be passed to the error occurred before calling the wrapped function.

```javascript
const increaseArgsCount = e => (e.property === 'arguments') ? e.values.concat(0, 0) : e

add
  .berror(increaseArgsCount)
```

### error(*function*)

> Attach an error handler to which will be passed to the error occurred during or after calling the wrapped function.

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

### clone(*function*)

> Returns a new wrapper with the same kernel function and sets of handlers.
> If you pass new function as argument of clone method then we get a new wrapper with another kernel function.


```javascript
const cloned_add = add.clone()

const cloned_subtract = add.clone((a, b) => a - b)
```

## License

MIT © [Taras Panasyuk](sumy.taras@gmail.com)
