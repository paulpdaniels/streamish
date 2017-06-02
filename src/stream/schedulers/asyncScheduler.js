/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
'use strict';

function timeoutAdapter(root, scheduler) {
  const {setTimeout, clearTimeout} = root;

  return function(state, delayTime, action) {
    const timeoutId = setTimeout(([state, scheduler]) => action(state, scheduler), delayTime, [state, scheduler]);
    return () => clearTimeout(timeoutId);
  }
}

class AsyncScheduler {
  constructor(root){
    this._schedule = timeoutAdapter(root, this);
  }

  schedule(state, delayTime) {
    return (action) => {
      return this._schedule(state, delayTime, action);
    }
  }
}

module.exports = AsyncScheduler;