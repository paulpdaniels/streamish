/**
 * Created by paulp on 7/8/2017.
 */

export default function fromEvent(source, eventName, projector) {
  const {on, off, removeEventListener, addEventListener} = source;

  if (addEventListener && removeEventListener) {
    const add = (h) => addEventListener.call(source, eventName, h);
    const remove = (token) => removeEventListener.call(source, eventName, token);

    return new EventPatternSource(add, remove, projector);
  } else if (on && off) {
    const add = (h) => on.call(source, eventName, h);
    const remove = (token) => off.call(source, eventName, token);
    return new EventPatternSource(add, remove, projector);
  }
}

class EventPatternSource {
  constructor(add, remove, projector) {
    this.add = add;
    this.remove = remove;
    this.projector = projector;
  }

  _subscribe(observer) {
    const next = (v) =>{
      let out = (this.projector && this.projector(v)) || v;
      observer.next(out);
    };

    const token = this.add(next);

    return new Subscription(() => this.remove(token));
  }
}