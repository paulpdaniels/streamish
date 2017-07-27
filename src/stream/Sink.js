/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
'use strict';
export class Sink {
  constructor(next, error, complete, context) {
    this._next || (this._next = next);
    this._error || (this._error = error);
    this._complete || (this._complete = complete);
    this.context = context || this;
    this.isStopped = false;
    this.sub = null;
  }

  run(source) {
    return this.sub || (this.sub = source.subscribe(this));
  }

  next(v) {
    if (!this.isStopped) {
      this._next.call(this.context, v);
    }
  }

  complete() {
    if (!this.isStopped) {
      this._complete.call(this.context);
      this.unsubscribe();
    }
  }

  error(e) {
    if (!this.isStopped) {
      this._error.call(this.context, e);
      this.unsubscribe();
    }
  }

  unsubscribe() {
    if (!this.isStopped) {
      this._unsubscribe();
      this.sub && this.sub.unsubscribe();
      this.isStopped = true;
    }
  }

  _unsubscribe() {}
}

'use strict';
export class ProtectedSink {
  constructor(underlying) {
    this.underlying = underlying;
    this.isStopped = false;
    this.sub = null;
  }

  run(source) {
    return this.sub || (this.sub = source.subscribe(this));
  }

  next(v) {
    if (!this.isStopped) {
      this.underlying.next(v, this);
    }
  }

  complete() {
    if (!this.isStopped) {
      this.underlying.complete(this);
      this.unsubscribe();
    }
  }

  error(e) {
    if (!this.isStopped) {
      this.underlying.error(e, this);
      this.unsubscribe();
    }
  }

  unsubscribe() {
    if (!this.isStopped) {
      this.underlying.unsubscribe && this.underlying.unsubscribe();
      this.sub && this.sub.unsubscribe();
      this.isStopped = true;
    }
  }
}