/**
 * Created by paulp on 7/7/2017.
 */


export default class ScheduledItem {
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