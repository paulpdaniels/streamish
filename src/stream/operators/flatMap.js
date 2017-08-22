/**
 *  Created - 5/31/2017
 *  @author Paul Daniels
 */


'use strict';
import {ConformantFlow} from '../Flow';
import {ProtectedSink, Sink} from '../Sink';
import { Subscription } from '../Subscription';
import {Stream} from "../Stream";

export default function flatMap(fn, concurrency = Number.POSITIVE_INFINITY) {
  return (flow, scheduler) => new ConformantFlow(new FlatMapFlow(flow, fn, concurrency, scheduler));
}

export class FlatMapFlow {
  constructor(flow, fn, concurrency, scheduler) {
    this.stream = flow;
    this.fn = fn;
    this.concurrency = concurrency;
    this.scheduler = scheduler;
  }

  subscribe(observer) {
    return FlatMapFlow
      .sink(this.fn, this.concurrency, observer)
      .run(this.stream);
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
    this.subs = new Subscription();
  }

  _next(v) {
    if (this.active < this.concurrency) {
      this.active++;
      this._activate(v);
    } else {
      // TODO: This is an opportunity to support bounded queue mechanics
      this.queue.push(v);
    }
  }

  _error(e) {
    this.observer.error(e);
  }

  complete() {
    if (!this.isStopped) {
      this.completed = true;
      if (this.active <= 0) {
        this.observer.complete();
        this.unsubscribe();
      }
    }
  }

  _activate(v) {
    const source = Stream(this.fn(v, this.index++), this.scheduler);
    const sub = new ProtectedSink(new InnerSink(StreamSink.proxy, this)).run(source);
    this.subs.add(sub);
    return sub;
  }

  completeInner() {
    this.active--;
    if (this.active < this.concurrency && this.queue.length > 0) {
      this.active++;
      this._activate(this.queue.shift());
    } else if (this.completed) {
      this.complete();
    }
  }

  errorInner(e) {
    this.error(e);
    this.unsubscribe();
  }

  _unsubscribe() {
    this.queue = [];
    this.active = 0;
    this.subs.unsubscribe();
  }
}

/**
 * A proxy observer object that is used to mock the standard Observer interface
 * and redirect them to the appropriate StreamSink methods
 * @type {{next: (function(*=)), error: (function(*=)), complete: (function())}}
 */
StreamSink.proxy = {
  next(v) {
    this.observer.next(v);
  },
  error(e) {
    this.errorInner(e);
  },
  complete() {
    this.completeInner();
  }
};

class InnerSink {
  constructor(proxy, context) {
    this.proxy = proxy;
    this.context = context;
  }

  next(v) {
    this.proxy.next.call(this.context, v);
  }

  error(e) {
    this.proxy.error.call(this.context, e);
  }

  complete() {
    this.proxy.complete.call(this.context);
  }
}