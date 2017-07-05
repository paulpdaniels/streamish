/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
'use strict';
import { Flow } from '../Flow';

export default function timeShift(delayTime, scheduler) {
  return f => new TimeShiftFlow(delayTime, scheduler, f);
}

class TimeShiftFlow extends Flow {
  constructor(delayTime, scheduler, stream) {
    super(stream);
    this.delayTime = delayTime;
    this.scheduler = scheduler;
    this.stream = stream;
  }

  _subscribe(observer) {
    return this.stream.subscribe(
      TimeShiftFlow.sink(this.delayTime, this.scheduler, observer)
    )
  }

  static sink(delayTime, scheduler, observer) {
    return new TimeShiftSink(delayTime, scheduler, observer);
  }
}

class TimeShiftSink {
  constructor(delayTime, scheduler, observer) {
    this.delayTime = delayTime;
    this.scheduler = scheduler;
    this.observer = observer;
  }

  next(v) {
    this.scheduler.schedule([this.observer, v], this.delayTime)(
      ([state, n]) => state.next(n)
    );
  }
  error(e) {
    this.observer.error(e);
  }
  complete() {
    this.scheduler.schedule(this.observer, this.delayTime)(
      (state) => state.complete()
    )
  }
}

module.exports = timeShift;