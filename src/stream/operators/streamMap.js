/**
 *  Created - 5/31/2017
 *  @author Paul Daniels
 */
'use strict';
const Flow = require('../Flow');

function streamMap(fn, flow) {
  return !!flow ? new StreamFlow(fn, flow) : f => streamMap(fn, f);
}

class StreamFlow extends Flow {
  constructor(fn, flow) {
    super(flow);
    this.fn = fn;
    this.flow = flow;
  }

  _subscribe(sink) {
    return this.flow.subscribe(this.sink(sink));
  }

  sink(observer) {
    return new StreamSink(this.fn, observer);
  }
}

class StreamSink {
  constructor(fn, observer) {
    this.fn = fn;
    this.observer = observer;
    this.active = 0;
    this.index = 0;
  }

  next(v) {
    this.fn(v, this.index++)
      .subscribe(new InnerSink(this, this.observer));

    this.active++;
  }
  error(e) {
    this.observer.error(e);
  }
  complete() {
    this.observer.complete();
  }

  completeInner() {
    this.active--;
  }
}

class InnerSink {
  constructor(parent, observer) {
    this.observer = observer;
    this.parent = parent;
  }

  next(v) {
    this.observer.next(v);
  }

  error(e) {
    this.observer.error(e);
  }

  complete() {
    this.parent.completeInner();
  }
}

module.exports = streamMap;