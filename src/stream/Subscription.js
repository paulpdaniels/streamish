/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
export class Subscription {
  constructor(fn) {
    this.fn = fn;
    this.disposed = false;
  }

  unsubscribe() {
    if (!this.disposed) {
      this.fn();
      this.disposed = true;
    }
  }
}