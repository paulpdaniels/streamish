/**
 *  Created - 5/31/2017
 *  @author Paul Daniels
 */


'use strict';
import {ConformantFlow} from '../Flow';
import {ProtectedSink} from '../Sink';

export default function map(fn) {
  return (flow, scheduler) => new ConformantFlow(new MapFlow(flow, fn, scheduler));
}

class MapFlow {
  constructor(flow, fn, scheduler) {
    this.stream = flow;
    this.scheduler = scheduler;
    this.fn = fn;

  }

  subscribe(observer) {
    return MapFlow.sink(this.fn, observer).run(this.stream);
  }

  static sink(fn, observer) {
    return new ProtectedSink(new MapSink(fn, observer));
  }
}

class MapSink {
  constructor(fn, observer) {
    this.fn = fn;
    this.observer = observer;
  }

  next(v, outer) {
    let _r, _e;
    try { _r = this.fn(v); } catch(e) { _e = e; }
    if (_e) {
      outer.error(_e);
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
