
import {Sink} from '../Sink';
import {Flow} from '../Flow';

export default function toArray() {
  return flow => new ToArrayFlow(flow);
}

class ToArrayFlow extends Flow {
  constructor(stream) {
    super(stream);
  }

  _subscribe(observer) {
    return ToArrayFlow.sink(observer).run(this.stream);
  }

  static sink(observer) {
    return new ToArraySink(observer);
  }
}

class ToArraySink extends Sink {
  constructor(observer) {
    super();
    this.observer = observer;
    this._buffer = [];
  }

  _next(v) {
    this._buffer.push(v);
  }

  _error(e) {
    this.observer.error(e);
  }

  _complete() {
    this.observer.next(this._buffer);
    this.observer.complete();
  }

  _unsubscribe() {
    this._buffer = null;
  }
}