/**
 * Created by paulp on 7/12/2017.
 */

import {Flow} from '../Flow';
import {Subscription} from '../Subscription';

export default function fromIterable(obj, scheduler) {
  return new IterableSource(obj, scheduler);
}

class IterableSource extends Flow {
  constructor(source, scheduler) {
    super();
    this.scheduler = scheduler;
    this.iterable = source;
  }

  static dispatchValue([iterator, sink], scheduler) {
    const {value, done} = iterator.next();

    if (done) {
      sink.complete();
    } else {
      try {
        sink.next(value);
        return scheduler.schedule([iterator, sink], 0, IterableSource.dispatchValue);
      } catch (e) {
        sink.error(e);
      }
    }
  }

  _subscribe(sink) {
    const {iterable} = this;
    if (this.scheduler) {
      // Need recursive scheduling
      return this.scheduler.schedule([iterable[Symbol.iterator](), sink], 0, IterableSource.dispatchValue);
    } else {
      for (let item of iterable) {
        try {
          sink.next(item);
        } catch (e) {
          sink.error(e);
        }
      }
      sink.complete();
      return Subscription.empty;
    }
  }
}