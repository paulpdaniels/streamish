/**
 *  Created - 5/31/2017
 *  @author Paul Daniels
 */
'use strict';
import { Flow } from '../Flow';

export default function map(fn) {
  return flow => new MapFlow(fn, flow);
}

class MapFlow extends Flow {
  constructor(fn, flow) {
    super(flow);
    this.fn = fn;
    this.flow = flow;

  }

  _subscribe(observer) {
    this.flow.subscribe(this.sink(observer));
  }

  sink(observer) {
    return new MapSink(this.fn, observer);
  }
}

class MapSink {
  constructor(fn, observer) {
    this.fn = fn;
    this.observer = observer;
  }

  next(v) {
    let _r, _e;
    try { _r = this.fn(v); } catch(e) { _e = e; }
    if (_e) {
      this.observer.error(_e);
    } else {
      this.observer.next(_r)
    }
  }
  error(e) {
    this.observer.error(e);
  }
  complete() {
    this.observer.complete();
  }
}

module.exports = map;