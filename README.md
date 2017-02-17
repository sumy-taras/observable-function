# observable-function

This module has wrapper which makes any function to observable and allows to control the params passed to function and the result of performing.


## Install

```bash
$ npm install observable-function
```


## Usage

```javascript

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

```


## API

Supported chainable notation. Handlers may be several.
Each handler receive one argument (*array*) and could return the result which will be used as argument for next handler (or wrapped function). If the type of returned value is Error then will be invoked sequentially all error handlers. If the error is processed and returned another value (not error) then processing will continue.

### before(*function*)

Attach function which will be called before wrapped function

### after(*function*)

Attach function which will be called after wrapped function

### error(*function*)

Attach error handler


## License

MIT © [Taras Panasyuk](sumy.taras@gmail.com)
