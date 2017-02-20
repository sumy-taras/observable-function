// TODO: need to apply thisArg
function arrayPassEach(array, iteratee, initAccum, isReverse) {
  let i = array.length;
  let maxIndex = array.length - 1;
  let accumulator = initAccum;
  while (i-- && !(accumulator instanceof Error)) {
  	let index = isReverse ? i : maxIndex - i;
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

module.exports = arrayPassEach;
