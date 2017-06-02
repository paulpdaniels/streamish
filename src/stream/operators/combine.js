/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
"use strict";
const Flow = require('../Flow');
const pipe = require('./pipe');
const streamMap = require('./flatMap');
const map = require('./map');
const Stream = require('../Stream');

function combine(fn, ...streams) {
  return !!streams ? new CombineFlow(fn) : (...f) => combine(fn, f);
}

function withIndex(stream, i) {
  return map(v => [i, v])(stream);
}

function isFull(count, array) {
  for (let i = 0; i < count; i++) {
    if (typeof array[i] === 'undefined')
      return false;
  }

  return true;
}

const unit = {__type: 'unit'};

class CombineFlow extends Flow {
  constructor(fn, streams) {
    super();
    this.fn = fn;
    this.streams = streams;
  }

  _subscribe(observer) {
    const values = new Array(this.streams.length);
    const _flow = pipe(
      streamMap(withIndex),
      map(([i, value]) => {
        values[i] = value;

        return isFull(this.streams.length, values) ?
          values.shift() :
          unit;
      }),
      filter(x => x !== unit)
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
    try {_r = this.fn(...v); } catch(e) { _e = e; }
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

module.exports = combine;