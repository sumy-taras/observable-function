const arrayPassEach = require('./array-pass-each')

const stub = () => undefined //void 0

const transferr = (...p) => p

const holderr = (...p) => () => p

const transfer = p => p

const holder = p => () => p



const casts = b => (typeof b === 'function') ? b : (b === undefined) ? transfer : holder(b)

const pushIfFunc = (a, e) => !(typeof e === 'function') || a.push(e)

const treatErrorOrUndefined = (a, efunc, u) => (a instanceof Error) ? efunc(a) : (a === undefined) ? u : a

const doErrorFunc = e => (a, func) => treatErrorOrUndefined(func(e), holder(a), a)

const doFunc = errHandler => (a, func) => treatErrorOrUndefined(func(a), errHandler, a)



const wrap = function(obj) {

  let pre = []
  let post = []
  let err = []

  let wrapper = function(...args) {
    const doMainFunc = function(params) { return treatErrorOrUndefined(casts(obj).apply(this, params), doError, undefined) }
    return doAfter(doMainFunc.bind(this)(doBefore(args)))
  }

  const doBefore = params => arrayPassEach(pre, doFunc(doError), params, true)
  const doAfter = params => arrayPassEach(post, doFunc(doError), params)

  // TODO: implement fastReduce() method for Array
  const doError = params => err.reduce(doErrorFunc(params), params)

  const storeFunc = a => e => pushIfFunc(a, e) && wrapper

  wrapper.before = storeFunc(pre)
  wrapper.after = storeFunc(post)
  wrapper.error = storeFunc(err)

  return wrapper
}

module.exports.wrap = wrap

module.exports.stub = stub
module.exports.transfer = transfer
module.exports.holder = holder
module.exports.transferr = transferr
module.exports.holderr = holderr
