/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
'use strict';

import { Flow } from './Flow';

export function interval(period, initialDelay, scheduler) {
  return new TimerFlow(initialDelay, period, scheduler);
}

export function timer(initial, period, scheduler) {
  return new TimerFlow(initial, period, scheduler);
}

class TimerFlow extends Flow {
  constructor(initialDelay, period, scheduler) {
    super();
    this.initialDelay = initialDelay;
    this.period = period;
    this.scheduler = scheduler;
  }

  _subscribe(observer) {
    return TimerFlow.sink(this.period, this.scheduler);
  }

  static sink(period, scheduler) {
    return new TimerSink(period, scheduler);
  }
}

class TimerSink {
  constructor(initialDelay, period, scheduler) {
    this.initialDelay = initialDelay;
    this.period = period;
    this.scheduler = scheduler;
  }

  static _timer([i, delay, observer], scheduler) {
    observer.next(i);
    return scheduler.schedule([++i, observer], delay)(TimerSink._timer)
  }

  next(v) {
    this.scheduler.schedule([0, this.period, this.observer], this.initialDelay)(TimerSink._timer);
  }
  error(e) {
    this.observer.error(e);
  }
  complete() {
    this.observer.complete();
  }
}