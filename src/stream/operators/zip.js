/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
'use strict';
import { Flow } from '../Flow';
import { Stream }  from '../Stream';
import flatMap from './flatMap';
import map from './map';
import filter from './filter';
import pipe from './pipe';
import _fill from "./internal/_fill";

export default function zip(fn) {
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
    const len = this.streams.length;
    const hasValues = new Array(len);
    _fill(hasValues, len, -1);
    const _flow = pipe(
      flatMap(withIndex),
      map(([i, value]) => {

        // Update the index that will be updated
        const cur = (hasValues[i] += 1);

        // We are in uncharted territory
        if (cur >= values.length) {
          values.push(new Array(len));
        }

        // The set the current value
        values[cur][i] = value;

        if (!hasValues.some(v => v < 0)) {
          const out = values.shift();
          // We have one less value for each hasValue
          for (let i = 0; i < len; ++i) { hasValues[i] -= 1; }
          return out;
        } else {
          return unit;
        }
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