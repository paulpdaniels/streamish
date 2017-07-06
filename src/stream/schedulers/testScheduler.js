/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
"use strict";

import {Subscription} from '../Subscription';
import {Flow} from '../Flow';

function sortByDelay({delay: a, index: ia}, {delay: b, index: ib}) {
  if (a === b) {
    if (ia === ib) return 0;
    else return ia < ib ? -1 : 1;
  }
  return a < b ? -1 : 1;
}

export class TestScheduler {
  constructor() {
    this.queue = [];
    this.frame = 0;
    this.index = 0;
    this.dirty = false;
  }

  schedule(state, delay, action) {
    const index = this.index++;
    const item = new ScheduledItem(this.now() + delay, index, state, action);
    this.queue.push(item);
    this.dirty = true;

    return item;
  }

  now() {
    return this.frame;
  }

  advanceBy(relativeTime) {
    if (relativeTime < 0) throw new Error('Relative time must be a positive value');
    this.advanceTo(this.now() + relativeTime);
  }

  advanceTo(absoluteTime) {
    if (absoluteTime < 0) throw new Error('Cannot advance to a negative time');
    if (!this.isRunning && this.queue.length > 0) {
      this.isRunning = true;
      while (this.isRunning && this.queue.length > 0) {
        this.queue.sort(sortByDelay);
        if (this.queue[0].delay <= absoluteTime) {
          const item = this.queue.shift();
          this.frame = item.delay;
          item.run(this);
        } else {
          this.isRunning = false;
        }
      }
    }

    this.frame = Math.max(this.frame, absoluteTime);
  }

  createHotStream(...notifications) {
    const scheduler = this;
    const stream = new Flow({
      subscribe(sink) {
        for (let n of notifications) {
          scheduler.schedule(n.value, n.at,
            value => {
              value.into(sink)
            }
          );
        }
      }
    });

    return stream;
  }

  createColdFlow(notifications) {

  }
}

class ScheduledItem {
  constructor(delay, index, state, action) {
    this.delay = delay;
    this.index = index;
    this.state = state;
    this.action = action;
    this.cancelled = false;
  }

  run(scheduler) {
    if (!this.cancelled)
      this.action(this.state, scheduler);
  }

  unsubscribe() {
    this.cancelled = true;
  }
}