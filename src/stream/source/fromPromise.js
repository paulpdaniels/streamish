/**
 * Created by paulp on 7/8/2017.
 */

import { Flow } from '../Flow';

export default function fromPromise(p, scheduler) {
  return new PromiseSource(p, scheduler);
}

class PromiseSource extends Flow {
  constructor(p, scheduler) {
    super();
    this.promise = p;
    this.scheduler = scheduler;
  }

  static dispatchValue([sink, value]) {
    sink.next(value);
    sink.complete();
  }

  static dispatchError([sink, error]) {
    sink.error(error);
  }

  _subscribe(sink) {
    this.promise.then(
      value => {
        if (this.scheduler) {
          this.scheduler.schedule([sink,value], 0, PromiseSource.dispatchValue);
        } else {
          PromiseSource.dispatchValue([sink, value]);
        }
      },
      error => {
        if (this.scheduler) {
          this.scheduler.schedule([sink, error], 0, PromiseSource.dispatchError);
        } else {
          PromiseSource.dispatchError([sink, error]);
        }

      }
    )
  }
}