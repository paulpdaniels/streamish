/**
 *  Created - 5/31/2017
 *  @author Paul Daniels
 */
'use strict';
import { Flow } from '../Flow';
import { Sink } from '../Sink';

export default function flatMap(fn, concurrency = Number.POSITIVE_INFINITY) {
  return (flow, scheduler) => new FlatMapFlow(fn, concurrency, flow, scheduler);
}

export class FlatMapFlow extends Flow {
  constructor(fn, concurrency, flow, scheduler) {
    super(flow, scheduler);
    this.fn = fn;
    this.concurrency = concurrency;
  }

  _subscribe(observer) {
    return FlatMapFlow.sink(this.fn, this.concurrency, observer).run(this.stream);
  }

  static sink(fn, concurrency, observer) {
    return new StreamSink(fn, concurrency, observer);
  }
}

class StreamSink extends Sink {
  constructor(fn, concurrency, observer) {
    super();
    this.fn = fn;
    this.observer = observer;
    this.concurrency = concurrency;
    this.active = 0;
    this.index = 0;
    this.queue = [];
  }

  _next(v) {
    if (this.active < this.concurrency) {
      this._activate(v);
      this.active++;
    } else {
      this.queue.push(v);
    }
  }

  _error(e) {
    this.observer.error(e);
  }

  _complete() {
    this.observer.complete();
  }

  _activate(v) {
    const source = this.fn(v, this.index++);
    return new InnerSink(this, this.observer).run(source);
  }

  completeInner() {
    this.active--;
    if (this.active < this.concurrency && this.queue.length > 0) {
      this._activate(this.queue.shift());
      this.active++;
    }
  }
}

class InnerSink extends Sink {
  constructor(parent, observer) {
    super();
    this.observer = observer;
    this.parent = parent;
  }

  _next(v) {
    this.observer.next(v);
  }

  _error(e) {
    this.observer.error(e);
  }

  _complete() {
    this.parent.completeInner();
  }
}