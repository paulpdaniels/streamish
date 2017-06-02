/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
"use strict";

function sortByDelay([a, ia], [b, ib]) {
  if (a === b) {
    if (ia === ib) return 0;
    else return ia < ib ? -1 : 1;
  }
  return a < b ? -1 : 1;
}

class TestScheduler {
  constructor() {
    this.queue = [];
    this.frame = 0;
    this.index = 0;
    this.dirty = false;
  }
  schedule(state, delay) {
    return (action) => {
      this.queue.push([this.now() + delay, this.index++, state, action]);
      this.dirty = true;
    }
  }

  now() {
    return this.frame;
  }

  advanceBy(relativeTime) {
    this.advanceTo(this.now() + relativeTime);
  }

  advanceTo(absoluteTime) {
    if (absoluteTime < 0) throw new Error('Cannot advance to a negative time');
    this.dirty && this.queue.sort(sortByDelay);
    this.frame = Math.max(this.frame, absoluteTime);
    while (this.queue.length > 0 && this.queue[0][0] <= this.frame) {
      const [,, state, action] = this.queue.shift();
      action(state, this);
    }
  }
}

module.exports = TestScheduler;