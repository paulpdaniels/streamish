/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
class Subscription {
  constructor(fn) {
    this.fn = fn;
    this.disposed = false;
  }

  unsubscribe() {
    if (!this.disposed) {
      fn();
      this.disposed = true;
    }
  }
}

module.exports = Subscription;