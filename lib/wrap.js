const arrayPassEach = require('./array-pass-each')
const { holder, casts } = require('./handy')



const pushIfFunc = (a, e) => !(typeof e === 'function') || a.push(e)

const treatErrorOrUndefined = (a, efunc, u) => (a instanceof Error) ? efunc(a) : (a === undefined) ? u : a

const doErrorFunc = e => (a, func) => treatErrorOrUndefined(func(e), holder(a), a)

const doFunc = errHandler => (a, func) => treatErrorOrUndefined(func(a), errHandler, a)

const wrap = function(obj) {

  let pre = []
  let post = []
  let berr = []
  let err = []
  let self = {}

  let wrapper = function(...args) {
    self = this
    return doAfter(doKernel(doBefore(args)))
  }

  const doMainFunc = errHandler => (a, func) => treatErrorOrUndefined(func.apply(self,a), errHandler, undefined)
  const doKernel = params => arrayPassEach([casts(obj)], doMainFunc(doError), params)
  const doBefore = params => arrayPassEach(pre, doFunc(doBError), params, true)
  const doAfter = params => arrayPassEach(post, doFunc(doError), params)

  // TODO: implement fastReduce() method for Array
  const doBError = params => berr.reduce(doErrorFunc(params), params)
  const doError = params => err.reduce(doErrorFunc(params), params)

  const storeFunc = a => e => pushIfFunc(a, e) && wrapper

  const clone = kernel => {
    let replica = wrap(kernel !== undefined ? kernel : obj)
    pre.forEach(el => replica.before(el))
    post.forEach(el => replica.after(el))
    berr.forEach(el => replica.berror(el))
    err.forEach(el => replica.error(el))
    return replica
  }

  wrapper.before = storeFunc(pre)
  wrapper.after = storeFunc(post)
  wrapper.berror = storeFunc(berr)
  wrapper.error = storeFunc(err)
  wrapper.clone = clone

  return wrapper
}

module.exports = { wrap }
