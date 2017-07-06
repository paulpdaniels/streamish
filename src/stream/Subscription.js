/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
export class Subscription {
  constructor(fn) {
    this.fn = [fn];
    this.disposed = false;
  }

  unsubscribe() {
    if (!this.disposed) {
      const { fn } = this;
      for (let f of fn) {
        f();
      }
      this.disposed = true;
    }
  }

  add(sub) {
    this.fn.push(sub);
    return this;
  }
}

Subscription.empty = new Subscription(() => {});