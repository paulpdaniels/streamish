/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
/**
 * Fake all the things!
 *
 * This is a simple class that lets us fake the window that we pass to the AsyncScheduler
 * Since the scheduler is DI constructed, we don't have any funky global state to deal with.
 */
export class FakeWindow {
  constructor(scheduler) {
    this.scheduler = scheduler;
    this.pending = {};
    this.index = 0;
  }

  setTimeout(fn, duration, ...args) {
    const current = this.index++;
    this.pending[current] = this.scheduler.schedule(args, duration)(
      (state, scheduler) => fn.apply(null, [...state, scheduler])
    );
    return current;
  }

  clearTimeout(id) {
    if (this.pending.hasOwnProperty(id.toString())) {
      this.pending[id].unsubscribe();
    }
  }
}