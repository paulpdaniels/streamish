/**
 *  Created - 5/31/2017
 *  @author Paul Daniels
 */
'use strict';
const Flow = require('../Flow');

function filter(fn, flow) {
  return !!flow ? new FilterFlow(fn, flow) : (f) => filter(fn, f);
}

class FilterFlow extends Flow {
  constructor(fn, flow) {
    super(flow);
    this.fn = fn;
    this.flow = flow;
  }

  _subscribe(observer) {
    return this.flow.subscribe(FilterFlow.sink(this.fn, observer));
  }

  static sink(fn, observer) {
    return new FilterSink(fn, observer);
  }
}

class FilterSink {
  constructor(fn, observer) {
    this.fn = fn;
    this.observer = observer;
  }

  next(v) {
    let _p, _e;
    try { _p = this.fn(v); } catch (e) { _e = e; }
    if (_e) {
      this.observer.error(_e);
    } else {
      _p && this.observer.next(v);
    }
  }
  error(e) { this.observer.error(e); }
  complete() { this.observer.complete(); }
}

module.exports = filter;