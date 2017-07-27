/**
 *  Created - 6/2/2017
 *  @author Paul Daniels
 */


"use strict";

import {ConformantFlow} from '../Flow';
import {ProtectedSink} from '../Sink';

export default function take(n) {
  return (f, s) => new ConformantFlow(new TakeFlow(n, f, s));
}

class TakeFlow {
  constructor(n, stream, scheduler) {
    this.stream = stream;
    this.scheduler = scheduler;
    this.n = n;
  }

  subscribe(observer) {
    return TakeFlow.sink(this.n, observer)
      .run(this.stream);
  }

  static sink(n, observer) {
    return new ProtectedSink(new TakeSink(n, observer));
  }
}

class TakeSink {
  constructor(n, observer) {
    this.n = n;
    this.observer = observer;
  }

  next(v) {
    this.n--;
    if (this.n < 0) {
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