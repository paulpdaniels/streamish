/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
'use strict';
import {Flow} from '../Flow';
import {Sink} from '../Sink';
import {Stream}  from '../Stream';
import flatMap from './flatMap';
import map from './map';
import filter from './filter';
import pipe from './pipe';
import _fill from "./internal/_fill";

export default function zip(fn, ...streams) {
  return (flow, scheduler) => new ZipFlow(fn, [flow, ...streams], scheduler);
}

function withIndex(stream, i) {
  return map(v => [i, v])(stream);
}

const unit = {__type: 'unit'};

class ZipFlow extends Flow {
  constructor(fn, streams, scheduler) {
    super(Stream(streams), scheduler);
    this.fn = fn;
    this.len = streams.length;
  }

  _subscribe(observer) {
    const values = [];
    const { len } = this;
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
          for (let i = 0; i < len; ++i) {
            hasValues[i] -= 1;
          }
          return out;
        } else {
          return unit;
        }
      }),
      filter(x => x !== unit)
    )(this.stream);

    return ZipFlow.sink(this.fn, observer).run(_flow);
  }

  static sink(fn, observer) {
    return new ZipSink(fn, observer);
  }
}

class ZipSink extends Sink {
  constructor(fn, observer) {
    super();
    this.fn = fn;
    this.observer = observer;
  }

  _next(v) {
    let _r, _e;
    try {
      _r = this.fn(...v);
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

