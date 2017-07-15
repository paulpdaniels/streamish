/**
 *  Created - 6/2/2017
 *  @author Paul Daniels
 */
"use strict";

import { Flow } from '../Flow';
import { Sink } from '../Sink';

export default function take(n) {
  return (f, s) => new TakeFlow(n, f, s);
}

class TakeFlow extends Flow {
  constructor(n, stream, scheduler) {
    super(stream, scheduler);
    this.n = n;
  }

  _subscribe(observer) {
    return TakeFlow.sink(this.n, observer)
      .run(this.stream);
  }

  static sink(n, observer) {
    return new TakeSink(n, observer);
  }
}

class TakeSink extends Sink {
  constructor(n, observer) {
    super();
    this.n = n;
    this.observer = observer;
  }

  _next(v) {
    this.n--;
    if (this.n < 0) {
      this.observer.complete();
    } else {
      this.observer.next(v);
    }
  }

  _error(e) {
    this.observer.error(e);
  }

  _complete() {
    this.observer.complete();
  }
}