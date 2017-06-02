/**
 *  Created - 6/2/2017
 *  @author Paul Daniels
 */
"use strict";

const Flow = require('../Flow');

function take(n) {
  return f => new TakeFlow(n, f);
}

class TakeFlow extends Flow {
  constructor(n, stream) {
    super(stream);
    this.n = n;
  }

  _subscribe(observer) {
    return super.stream.subscribe(TakeFlow.sink(this.n, observer));
  }

  static sink(n, observer) {
    return new TakeSink(n, observer);
  }
}

class TakeSink {
  constructor(n, observer) {
    this.n = n;
    this.observer = observer;
  }

  next(v) {
    this.n--;
    if (this.n <= 0) {
      this.observer.complete();
    } else {
      this.observer.next(v);
    }
  }

  error(e) {
    this.observer.error(e);
  }

  complete() {
    this.observer.complete();
  }
}

module.exports = take;