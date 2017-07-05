/**
 *  Created - 6/2/2017
 *  @author Paul Daniels
 */
"use strict";

import { Flow } from '../Flow';

export default function skip(n) {
  return f => new SkipFlow(n, f);
}

class SkipFlow extends Flow {
  constructor(n, stream) {
    super(stream);
    this.n = n;
  }

  _subscribe(observer) {
    return this.stream.subscribe(SkipFlow.sink(this.n, observer));
  }

  static sink(n, observer) {
    return new SkipSink(n, observer);
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