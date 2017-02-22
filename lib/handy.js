const stub = () => undefined //void 0

const transferr = (...p) => p

const holderr = (...p) => () => p

const transfer = p => p

const holder = p => () => p

const casts = b => (typeof b === 'function') ? b : (b === undefined) ? transfer : holder(b)

module.exports = { stub, transfer, holder, transferr, holderr, casts }
