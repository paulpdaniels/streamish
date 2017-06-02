/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
const Flow = require('../Flow');

function scan(fn, seed, flow) {
  return !!flow ? new ScanFlow(fn, seed, flow) : flow => scan(fn, seed, flow);
}

class ScanFlow extends Flow {
  constructor(fn, seed, flow) {
    super(flow);
    this.fn = fn;
    this.seed = seed;
    this.flow = flow;
  }

  _subscribe(observer) {
    return this.flow.subscribe(this.sink(observer));
  }

  sink(observer) {
    return new ScanSink(this.fn, this.seed, observer);
  }
}

class ScanSink {
  constructor(fn, seed, observer) {
    this.observer = observer;
    this.seed = seed;
    this.fn = fn;
  }

  next(v) {
    const _r = this.fn(this.seed, v);
    this.seed = _r;
    this.observer.next(_r);
  }
  error(e) {
    this.observer.error(e);
  }
  complete() {
    this.observer.complete();
  }
}

module.exports = scan;