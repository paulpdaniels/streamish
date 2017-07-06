/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
"use strict";
import {Flow} from '../Flow';
import {Sink} from '../Sink';
import _fill from './internal/_fill';
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

class CombineFlow extends Flow {
  constructor(fn, streams, scheduler) {
    super(Stream(streams), scheduler);
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

  _subscribe(observer) {
    const values = new Array(this.len);
    const hasValues = new Array(this.len);
    _fill(hasValues, this.len, false);

    const _flow = pipe(
      streamMap(withIndex),
      map(CombineFlow._curriedMap(values, hasValues)),
      filter(_ => hasValues.indexOf(false) < 0)
    )(this.stream);

    return CombineFlow.sink(this.fn, observer).run(_flow);
  }

  static sink(fn, observer) {
    return new CombineSink(fn, observer);
  }
}

class CombineSink extends Sink {
  constructor(fn, observer) {
    super();
    this.fn = fn;
    this.observer = observer;
  }

  _next(v) {
    let _r, _e;
    try {
      _r = this.fn.apply(null, v);
    } catch (e) {
      _e = e;
    }
    if (_e) {
      this.error(_e);
    } else {
      this.observer.next(_r);
    }
  }

  _error(e) {
    this.observer.error(e);
  }

  _complete() {
    this.observer.complete();
  }
}