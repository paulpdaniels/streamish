/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
class Flow {
  constructor(stream) {
    this.stream = stream;
  }

  subscribe(observer) {
    return this._subscribe(observer);
  }

  _subscribe(sink) {
    return this.stream.subscribe(sink);
  }
}

module.exports = Flow;