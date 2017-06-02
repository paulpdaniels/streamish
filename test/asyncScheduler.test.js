/**
 *  Created - 6/1/2017
 *  @author Paul Daniels
 */
'use strict';
const AsyncScheduler = require('../src/stream/schedulers/asyncScheduler');

test('should schedule tasks asynchronously', (done) => {

  const scheduler = new AsyncScheduler({setTimeout, clearTimeout});
  let actual;

  scheduler.schedule(42, 10)(
    s => actual = s
  );

  setTimeout(function() {
    expect(actual).toBe(42);
    done();
  }, 10);

});