
import {ConformantFlow} from "../Flow";
import {ProtectedSink, Sink} from "../Sink";

function takeUntil(signal) {
  return (flow, scheduler) => new ConformantFlow(new TakeUntilFlow(flow, signal, scheduler));
}

class TakeUntilFlow {
  constructor(flow, signal, scheduler) {
    this.stream = flow;
    this.signal = signal;
    this.scheduler = scheduler;
  }

  _subscribe(observer) {
    const {signal, scheduler} = this;
    return TakeUntilFlow.sink(observer, signal, scheduler).run(this.stream);
  }

  static sink(observer, signal, scheduler) {
    return new ProtectedSink(new TakeUntilSink(observer, signal, scheduler));
  }
}

class TakeUntilSink {
  constructor(observer, signal, scheduler) {
    this.observer = observer;
    this.signal = signal;
    this.scheduler = scheduler;

    this.completionAction = this.signal.subscribe(TakeUntilSink.completionSink(observer));
  }

  static completionSink(observer) {
    return new Sink(() => observer.complete());
  }

  next(v) {
    this.observer.next(v);
  }

  complete() {
    const {completionAction} = this;
    this.observer.complete();
    completionAction.unsubscribe();
    this.completionAction = null;
  }

  error(e) {
    this.observer.error(e);
  }
}