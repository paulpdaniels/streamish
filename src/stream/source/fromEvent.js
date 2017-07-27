/**
 * Created by paulp on 7/8/2017.
 */

import {Subscription} from '../Subscription';
import {ConformantFlow} from "../Flow";

export default function fromEvent(source, eventName, projector) {
  const {on, off, removeEventListener, addEventListener} = source;

  if (addEventListener && removeEventListener) {
    const add = (h) => {
      const token = addEventListener.call(source, eventName, h);
      return token === source ? h : token;
    };
    const remove = (token) => removeEventListener.call(source, eventName, token);

    return new ConformantFlow(new EventPatternSource(add, remove, projector));
  } else if (on) {
    const add = (h) => {
      const token = on.call(source, eventName, h);
      return token === source ? h : token;
    };
    const remove = (token) => off && off.call(source, eventName, token);
    return new ConformantFlow(new EventPatternSource(add, remove, projector));
  }
}

class EventPatternSource {
  constructor(add, remove, projector) {
    this.add = add || (() => Subscription.empty);
    this.remove = remove || (() => {
    });
    this.projector = projector;
  }

  subscribe(observer) {
    const next = (v) => {
      let out = (this.projector && this.projector(v)) || v;
      observer.next(out);
    };

    let token = this.add(next);

    return new Subscription(() => this.remove(token));
  }
}