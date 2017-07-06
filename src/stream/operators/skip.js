/**
 *  Created - 6/2/2017
 *  @author Paul Daniels
 */
"use strict";

import { Flow } from '../Flow';
import { Sink } from '../Sink';

export default function skip(n) {
  return f => new SkipFlow(n, f);
}

class SkipFlow extends Flow {
  constructor(n, stream) {
    super(stream);
    this.n = n;
  }

  _subscribe(observer) {
    return SkipFlow.sink(this.n, observer).run(this.stream);
  }

  static sink(n, observer) {
    return new SkipSink(n, observer);
  }
}

class SkipSink extends Sink {
  constructor(n, observer) {
    super();
    this.n = n;
    this.observer = observer;
  }

  _next(v) {
    this.n--;
    if (this.n < 0) {
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