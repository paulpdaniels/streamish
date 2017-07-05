/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
"use strict";
import { Flow } from '../Flow';
import _fill from './internal/_fill';
import pipe from './pipe';
import streamMap from './flatMap';
import map from './map';
import filter from './filter';
import { Stream } from '../Stream';

export default function combine(fn, ...streams) {
  return (f) => new CombineFlow(fn, [f, ...streams]);
}

function withIndex(stream, i) {
  return map(v => [i, v])(stream);
}

class CombineFlow extends Flow {
  constructor(fn, streams) {
    super();
    this.fn = fn;
    this.streams = streams;
  }

  static _curriedMap(values, hasValues) {
    return ([i, value]) => {
      values[i] = value;
      hasValues[i] = true;

      return values;
    }
  }

  _subscribe(observer) {
    const values = new Array(this.streams.length);
    const hasValues = new Array(this.streams.length);
    _fill(hasValues, this.streams.length, false);

    const _flow = pipe(
      streamMap(withIndex),
      map(CombineFlow._curriedMap(values, hasValues)),
      filter(_ => hasValues.indexOf(false) < 0)
    )(Stream(this.streams));

    return _flow.subscribe(CombineFlow.sink(this.fn, observer));
  }

  static sink(fn, observer) {
    return new CombineSink(fn, observer);
  }
}

class CombineSink {
  constructor(fn, observer) {
    this.fn = fn;
    this.observer = observer;
  }

  next(v) {
    let _r, _e;
    try {_r = this.fn.apply(null, v); } catch(e) { _e = e; }
    if (_e) {
      this.observer.error(_e);
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