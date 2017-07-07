/**
 *  Created - 5/31/2017
 *  @author Paul Daniels
 */
'use strict';
import { Flow } from '../Flow';
import { Sink } from '../Sink';

export default function map(fn) {
  return (flow, scheduler) => new MapFlow(fn, flow, scheduler);
}

class MapFlow extends Flow {
  constructor(fn, flow, scheduler) {
    super(flow, scheduler);
    this.fn = fn;

  }

  _subscribe(observer) {
    return MapFlow.sink(this.fn, observer).run(this.stream);
  }

  static sink(fn, observer) {
    return new MapSink(fn, observer);
  }
}

class MapSink extends Sink {
  constructor(fn, observer) {
    super();
    this.fn = fn;
    this.observer = observer;
  }

  _next(v) {
    let _r, _e;
    try { _r = this.fn(v); } catch(e) { _e = e; }
    if (_e) {
      this.error(_e);
    } else {
      this.observer.next(_r)
    }
  }

  _error(e) {
    this.observer.error(e);
  }

  _complete() {
    this.observer.complete();
  }
}
