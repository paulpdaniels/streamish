/**
 * Created by paulp on 7/8/2017.
 */


import symbolObservable from 'symbol-observable'


export default function getObservable(o) { // eslint-disable-line complexity

  let obs = null;

  if (o) {
    // Access foreign method only once
    let method = o[symbolObservable];

    if (typeof method === 'function') {
      obs = method.call(o);
      if (!(obs && typeof obs.subscribe === 'function')) {
        throw new TypeError('invalid observable ' + obs)
      }
    }
  }

  return obs
}