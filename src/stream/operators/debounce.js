/**
 * Created by paulp on 7/4/2017.
 */

import {Flow} from '../Flow';
import {Sink} from '../Sink';

export default function debounce(delay) {
  return (flow, scheduler) => new DebounceFlow(flow, delay, scheduler);
}

class DebounceFlow extends Flow {
  constructor(flow, delay, scheduler) {
    super(flow);
    this.delay = delay;
    this.scheduler = scheduler;
  }

  _subscribe(observer) {
    return DebounceFlow.sink(observer, this.delay, this.scheduler)
      .run(this.stream);
  }

  static sink(observer, delay, scheduler) {
    return new DebounceSink(observer, delay, scheduler);
  }
}

class DebounceSink extends Sink {
  constructor(observer, delay, scheduler) {
    super();
    this.observer = observer;
    this.delay = delay;
    this.scheduler = scheduler;
    this.debouncer = null;
  }

  static action(state) {
    const [observer, value] = state;
    observer.next(value);
  }

  _next(v) {
    this.debouncer && this.debouncer.unsubscribe();
    this.debouncer = this.scheduler.schedule([this.observer, v], this.delay, DebounceSink.action)
  }

  _error(e) {
    this.observer.error(e);
  }

  _complete() {
    this.observer.complete();
  }

  _unsubscribe() {
    this.debouncer && this.debouncer.unsubscribe();
  }
}