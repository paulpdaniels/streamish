
import {Flow} from "../Flow";

function window(duration) {
  return flow => new WindowFlow(flow, duration);
}

class WindowFlow extends Flow {
  constructor(flow, duration) {
    super(flow);
    this.duration = duration;
  }
}

