/**
 *  Created - 5/31/2017
 *  @author Paul Daniels
 */
'use strict';
const Flow = require('../Flow');

function flatMap(fn, concurrency = Number.POSITIVE_INFINITY) {
  return flow => new StreamFlow(fn, concurrency, flow);
}

class StreamFlow extends Flow {
  constructor(fn, concurrency, flow) {
    super(flow);
    this.fn = fn;
    this.concurrency = concurrency;
    this.flow = flow;
  }

  _subscribe(sink) {
    return this.flow.subscribe(StreamFlow.sink(this.fn, this.concurrency, sink));
  }

  static sink(fn, concurrency, observer) {
    return new StreamSink(fn, concurrency, observer);
  }
}

class StreamSink {
  constructor(fn, concurrency, observer) {
    this.fn = fn;
    this.observer = observer;
    this.concurrency = concurrency;
    this.active = 0;
    this.index = 0;
    this.queue = [];
  }

  next(v) {
    if (this.active < this.concurrency) {
      this.activate(v);
      this.active++;
    } else {
      this.queue.push(v);
    }
  }

  error(e) {
    this.observer.error(e);
  }

  complete() {
    this.observer.complete();
  }

  activate(v) {
    this.fn(v, this.index++)
      .subscribe(new InnerSink(this, this.observer));
  }

  completeInner() {
    this.active--;
    if (this.active < this.concurrency && this.queue.length > 0) {
      this.activate(this.queue.shift());
      this.active++;
    }
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

module.exports = flatMap;