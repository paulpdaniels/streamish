/**
 *  Created - 6/2/2017
 *  @author Paul Daniels
 */
'use strict';

export default function toPromise(promiseCtor = Promise, scheduler) {
  return flow => promiseCtor((resolve, reject) => {
    let value;
    // We don't bother capturing the subscription because promises can't
    // be cancelled
    flow.subscribe({
      next(v) { value = v; },
      error(e) { reject(e); },
      complete() { resolve(value); }
    })
  });
}