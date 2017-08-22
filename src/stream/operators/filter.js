/**
 *  Created - 5/31/2017
 *  @author Paul Daniels
 */


'use strict';
import {ConformantFlow} from '../Flow';
import {ProtectedSink} from '../Sink';

export default function filter(fn) {
  return (flow, scheduler) => new ConformantFlow(new FilterFlow(flow, fn, scheduler));
}

class FilterFlow {
  constructor(flow, fn, scheduler) {
    this.stream = flow;
    this.scheduler = scheduler;
    this.fn = fn;
  }

  subscribe(observer) {
    return FilterFlow.sink(this.fn, observer).run(this.stream);
  }

  static sink(fn, observer) {
    return new ProtectedSink(new FilterSink(fn, observer));
  }
}

class FilterSink {
  constructor(fn, observer) {
    this.fn = fn;
    this.observer = observer;
  }

  next(v, outer) {
    let _p, _e;
    try { _p = this.fn(v); } catch (e) { _e = e; }
    if (_e) {
      outer.error(_e);
    } else {
      _p && this.observer.next(v);
    }
  }

  error(e) {
    this.observer.error(e);
  }
  complete() {
    this.observer.complete();
  }
}