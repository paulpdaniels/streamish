
import {ProtectedSink} from '../Sink';
import {ConformantFlow} from '../Flow';

export default function toArray() {
  return flow => new ConformantFlow(new ToArrayFlow(flow));
}

class ToArrayFlow {
  constructor(stream) {
    this.stream = stream;
  }

  subscribe(observer) {
    return ToArrayFlow.sink(observer).run(this.stream);
  }

  static sink(observer) {
    return new ProtectedSink(new ToArraySink(observer));
  }
}

class ToArraySink {
  constructor(observer) {
    this.observer = observer;
    this._buffer = [];
  }

  next(v) {
    this._buffer.push(v);
  }

  error(e) {
    this.observer.error(e);
  }

  complete() {
    this.observer.next(this._buffer);
    this.observer.complete();
  }

  unsubscribe() {
    this._buffer = null;
  }
}