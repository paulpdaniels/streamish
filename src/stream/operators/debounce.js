/**
 * Created by paulp on 7/4/2017.
 */

import {ConformantFlow} from '../Flow';
import {ProtectedSink} from '../Sink';

export default function debounce(delay) {
  return (flow, scheduler) => new ConformantFlow(new DebounceFlow(flow, delay, scheduler));
}

class DebounceFlow {
  constructor(flow, delay, scheduler) {
    this.stream = flow;
    this.delay = delay;
    this.scheduler = scheduler;
  }

  subscribe(observer) {
    return DebounceFlow
      .sink(observer, this.delay, this.scheduler)
      .run(this.stream);
  }

  static sink(observer, delay, scheduler) {
    return new ProtectedSink(new DebounceSink(observer, delay, scheduler));
  }
}

class DebounceSink {
  constructor(observer, delay, scheduler) {
    this.observer = observer;
    this.delay = delay;
    this.scheduler = scheduler;
    this.debouncer = null;
  }

  static action(state) {
    const [observer, value] = state;
    observer.next(value);
  }

  next(v) {
    this.debouncer && this.debouncer.unsubscribe();
    this.debouncer = this.scheduler.schedule([this.observer, v], this.delay, DebounceSink.action)
  }

  error(e) {
    this.observer.error(e);
  }

  complete() {
    this.observer.complete();
  }

  unsubscribe() {
    this.debouncer && this.debouncer.unsubscribe();
  }
}