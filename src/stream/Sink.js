/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
class Sink {
  constructor(next, error, complete, context) {
    this._next = next;
    this._error = error;
    this._complete = complete;
    this.context = context;
  }

  next(v) {
    this._next.call(this.context, v);
  }

  complete() {
    this._complete.call(this.context);
  }

  error(e) {
    this._error.call(this.context, e);
  }

}

module.exports = Sink;