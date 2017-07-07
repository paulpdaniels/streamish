/**
 * Created by paulp on 7/5/2017.
 */

export class Notification {
  constructor(kind, value) {
    this.kind = kind;
    this.value = value;
  }

  into(sink) {
    switch (this.kind) {
      case 'N':
        sink.next(this.value);
        break;
      case 'E':
        sink.error(this.value);
        break;
      case 'C':
        sink.complete();
        break;
    }
  }

  static createNext(v) {
    return new Notification('N', v);
  }

  static createError(e) {
    return new Notification('E', e);
  }

  static createComplete() {
    return Notification.Completed;
  }
}

Notification.Completed = new Notification('C');

export class Record {
  constructor(notification, time) {
    this.value = notification;
    this.at = time;
  }

  static next(at, value) { return new Record(Notification.createNext(value), at); }
  static error(at, value) { return new Record(Notification.createError(value), at); }
  static complete(at) { return new Record(Notification.createComplete(), at); }
}