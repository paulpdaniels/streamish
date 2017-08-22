/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */

"use strict";
import {ProtectedSink} from '../Sink';
import pipe from './pipe';
import streamMap from './flatMap';
import map from './map';
import filter from './filter';
import {Stream} from '../Stream';

export default function combine(fn, ...streams) {
  return (f, scheduler) => new CombineFlow(fn, [f, ...streams], scheduler);
}

function withIndex(stream, i) {
  return map(v => [i, v])(stream);
}

class CombineFlow {
  constructor(fn, streams, scheduler) {
    this.stream = Stream(streams);
    this.scheduler = scheduler;
    this.fn = fn;
    this.len = streams.length;
  }

  static _curriedMap(values, hasValues) {
    return ([i, value]) => {
      values[i] = value;
      hasValues[i] = true;

      return values;
    }
  }

  subscribe(observer) {
    const values = new Array(this.len);
    const hasValues = new Array(this.len).fill(false);

    const _flow = pipe(
      streamMap(withIndex),
      map(CombineFlow._curriedMap(values, hasValues)),
      filter(_ => hasValues.indexOf(false) < 0)
    )(this.stream);

    return CombineFlow.sink(this.fn, observer).run(_flow);
  }

  static sink(fn, observer) {
    return new ProtectedSink(new CombineSink(fn, observer));
  }
}

class CombineSink {
  constructor(fn, observer) {
    this.fn = fn;
    this.observer = observer;
  }

  next(v, outer) {
    let _r, _e;
    try {
      _r = this.fn.apply(null, v);
    } catch (e) {
      _e = e;
    }
    if (_e) {
      outer.error(_e);
    } else {
      this.observer.next(_r);
    }
  }

  error(e) {
    this.observer.error(e);
  }

  complete() {
    this.observer.complete();
  }
}