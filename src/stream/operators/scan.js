/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
'use strict';
import {Flow} from '../Flow';
import {Sink} from '../Sink';

export default function scan(fn, seed) {
  return (flow, scheduler) => new ScanFlow(fn, seed, flow, scheduler);
}

class ScanFlow extends Flow {
  constructor(fn, seed, flow, scheduler) {
    super(flow, scheduler);
    this.fn = fn;
    this.seed = seed;
  }

  _subscribe(observer) {
    return this.sink(observer).run(this.stream);
  }

  sink(observer) {
    return new ScanSink(this.fn, this.seed, observer);
  }
}

class ScanSink extends Sink {
  constructor(fn, seed, observer) {
    super();
    this.observer = observer;
    this.seed = seed;
    this.fn = fn;
  }

  _next(v) {
    try {
      const r = this.fn(this.seed, v);
      this.seed = r;
      this.observer.next(r);
    } catch (e) {
      this.error(e);
    }
  }

  _error(e) {
    this.observer.error(e);
  }

  _complete() {
    this.observer.complete();
  }
}