/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */

'use strict';
import {ConformantFlow} from '../Flow';
import {ProtectedSink} from '../Sink';

export default function scan(fn, seed) {
  return (flow, scheduler) => new ConformantFlow(new ScanFlow(fn, seed, flow, scheduler));
}

class ScanFlow {
  constructor(fn, seed, flow, scheduler) {
    this.stream = flow;
    this.scheduler = scheduler;
    this.fn = fn;
    this.seed = seed;
  }

  subscribe(observer) {
    return this.sink(observer).run(this.stream);
  }

  sink(observer) {
    return new ProtectedSink(new ScanSink(this.fn, this.seed, observer));
  }
}

class ScanSink {
  constructor(fn, seed, observer) {
    this.observer = observer;
    this.seed = seed;
    this.fn = fn;
  }

  next(v) {
    try {
      const r = this.fn(this.seed, v);
      this.seed = r;
      this.observer.next(r);
    } catch (e) {
      this.error(e);
    }
  }

  error(e) {
    this.observer.error(e);
  }

  complete() {
    this.observer.complete();
  }
}