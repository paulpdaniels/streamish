/**
 *  Created - 5/31/2017
 *  @author Paul Daniels
 */
'use strict';
import { Flow } from '../Flow';
import { Sink } from '../Sink';

export default function filter(fn) {
  return (flow, scheduler) => new FilterFlow(fn, flow, scheduler);
}

class FilterFlow extends Flow {
  constructor(fn, flow, scheduler) {
    super(flow, scheduler);
    this.fn = fn;
  }

  _subscribe(observer) {
    return FilterFlow.sink(this.fn, observer).run(this.stream);
  }

  static sink(fn, observer) {
    return new FilterSink(fn, observer);
  }
}

class FilterSink extends Sink {
  constructor(fn, observer) {
    super();
    this.fn = fn;
    this.observer = observer;
  }

  _next(v) {
    let _p, _e;
    try { _p = this.fn(v); } catch (e) { _e = e; }
    if (_e) {
      this.error(_e);
    } else {
      _p && this.observer.next(v);
    }
  }

  _error(e) {
    this.observer.error(e);
  }
  _complete() {
    this.observer.complete();
  }
}