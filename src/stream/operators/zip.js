/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
'use strict';
const Flow = require('../Flow');
const Stream = require('../Stream');
const streamMap = require('./streamMap');
const map = require('./map');
const filter = require('./filter');
const pipe = require('./pipe');

function zip(fn) {
  return (...streams) => new ZipFlow(fn, streams);
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

class ZipFlow extends Flow {
  constructor(fn, streams) {
    super();
    this.fn = fn;
    this.streams = streams;
  }

  _subscribe(observer) {
    const values = [];
    const _flow = pipe(
      streamMap(withIndex),
      map(([i, value]) => {
        let updated = false;
        for (let j = 0; j < values.length; ++j) {
          if (typeof values[j][i] === 'undefined') {
            values[j][i] = value;
            updated = true;
            break;
          }
        }

        if (!updated)
          values.push([]) && (values[values.length - 1][i] = value);

        return isFull(this.streams.length, values[0]) ?
          values.shift() :
          unit;
      }),
      filter(x => x !== unit)
    )(Stream(this.streams));

    return _flow.subscribe(ZipFlow.sink(this.fn, observer));
  }

  static sink(fn, observer) {
    return new ZipSink(fn, observer);
  }
}

class ZipSink {
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

module.exports = zip;