/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */


'use strict';
import {ConformantFlow} from '../Flow';
import {ProtectedSink} from '../Sink';
import {Stream}  from '../Stream';
import flatMap from './flatMap';
import map from './map';
import filter from './filter';
import pipe from './pipe';

export default function zip(fn, ...streams) {
  return (flow, scheduler) => new ConformantFlow(new ZipFlow(fn, [flow, ...streams], scheduler));
}

function withIndex(stream, i) {
  return map(v => [i, v])(stream);
}

const unit = {__type: 'unit'};

function doZip(values, hasValues, len) {
  return ([i, value]) => {
    const cur = (hasValues[i] += 1);

    // We are in uncharted territory
    if (cur >= values.length) {
      values.push(new Array(len));
    }

    // Then set the current value
    values[cur][i] = value;

    if (!hasValues.some(v => v < 0)) {
      const out = values.shift();
      // We have one less value for each hasValue
      for (let i = 0; i < len; ++i) {
        hasValues[i] -= 1;
      }
      return out;
    } else {
      return unit;
    }
  }
}

class ZipFlow {
  constructor(fn, streams, scheduler) {
    this.stream = Stream(streams);
    this.scheduler = scheduler;
    this.fn = fn;
    this.len = streams.length;
  }

  subscribe(observer) {
    const values = [];
    const { len } = this;
    const hasValues = new Array(len).fill(-1);
    const _flow = pipe(
      flatMap(withIndex),
      map(doZip(values, hasValues, len)),
      filter(x => x !== unit)
    )(this.stream);

    return ZipFlow.sink(this.fn, observer).run(_flow);
  }

  static sink(fn, observer) {
    return new ProtectedSink(new ZipSink(fn, observer));
  }
}

class ZipSink {
  constructor(fn, observer) {
    this.fn = fn;
    this.observer = observer;
  }

  next(v, outer) {
    let _r, _e;
    try {
      _r = this.fn(...v);
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

