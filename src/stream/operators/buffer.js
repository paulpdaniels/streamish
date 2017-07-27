
import {ConformantFlow} from "../Flow";
import {ProtectedSink} from "../Sink";

export default function buffer(count) {
  return (flow, scheduler) => new ConformantFlow(new BufferFlow(flow, count, scheduler));
}

class BufferFlow {
  constructor(stream, count, scheduler) {
    this.stream = stream;
    this.count = count;
    this.scheduler = scheduler;
  }

  subscribe(observer) {
    return BufferFlow
      .sink(observer, this.count, this.scheduler)
      .run(this.stream);
  }

  static sink(observer, count, scheduler) {
    return new ProtectedSink(new BufferSink(observer, count, scheduler));
  }
}

class BufferSink {
  constructor(observer, count, scheduler) {
    this.observer = observer;
    this.count = count;
    this.scheduler = scheduler;
    this.buffer = [];
  }

  next(v) {
    const {buffer} = this;
    buffer.push(v);
    if (buffer.length >= this.count) {
      // Reassign the buffer before continuing
      this.buffer = [];
      this.observer.next(buffer);
    }
  }

  error(e) {
    // Clear the buffer
    this.buffer = null;
    this.observer.error(e);
  }

  complete() {
    // TODO finalize buffer
    const {buffer} = this;
    if (buffer.length > 0) {
      this.buffer = [];
      this.observer.next(buffer);
    }
    this.observer.complete();
  }
}