/**
 * Created by paulp on 7/7/2017.
 */


import ScheduledItem from "./scheduledItem";
import {sortByDelay} from "./helpers";
export class VirtualTimeScheduler {
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
        // TODO Optimize this, this is super inefficient
        this.queue.sort(sortByDelay);
        if (this.queue[0].delay <= absoluteTime) {
          const item = this.queue.shift();
          this.frame = item.delay;
          item.run(this);
        } else {
          this.isRunning = false;
        }
      }
      this.isRunning = false;
    }

    this.frame = Math.max(this.frame, absoluteTime);
  }

  flush() {
    if (!this.isRunning && this.queue.length > 0) {
      this.isRunning = true;
      while (this.queue.length > 0) {
        this.queue.sort(sortByDelay);
        const item = this.queue.shift();
        this.frame = item.delay;
        item.run(this);
      }
      this.isRunning = false;
    }
  }
}