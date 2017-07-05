/**
 * Created by paulp on 7/4/2017.
 */

export class QueueScheduler {

  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  schedule(state, delayTime) {
    return (action) => {
      this.queue.push(new ScheduledItem(state, delayTime, action));
      if (!this.isProcessing) {
        // Keeps recursive scheduling from kicking this off
        this.isProcessing = true;
        while (this.queue.length > 0) {
          this.tryProcess(this.queue.shift());
        }
        this.isProcessing = false;
      }
    };
  }

  tryProcess(item) {
    const { state, action, cancel } = item;
    return action(state, this);
  }

}

class ScheduledItem {
  constructor(state, delayTime, action) {
    this.state = state;
    this.delayTime = delayTime;
    this.action = action;
    this.cancel = false;
  }
}