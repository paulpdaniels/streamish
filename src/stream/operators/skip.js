/**
 *  Created - 6/2/2017
 *  @author Paul Daniels
 */


"use strict";

import {ConformantFlow} from '../Flow';
import {ProtectedSink} from '../Sink';

export default function skip(n) {
  return flow => new ConformantFlow(new SkipFlow(flow, n));
}

class SkipFlow {
  constructor(stream, n) {
    this.stream = stream;
    this.n = n;
  }

  subscribe(observer) {
    return SkipFlow
      .sink(this.n, observer)
      .run(this.stream);
  }

  static sink(n, observer) {
    return new ProtectedSink(new SkipSink(n, observer));
  }
}

class SkipSink {
  constructor(n, observer) {
    this.n = n;
    this.observer = observer;
  }

  next(v) {
    this.n--;
    if (this.n < 0) {
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