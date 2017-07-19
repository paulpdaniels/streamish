/**
 * Created by paulp on 7/15/2017.
 */

import fromEvent from "../src/stream/source/fromEvent";
import subscribe from "../src/stream/operators/subscribe";
import {EventEmitter2} from 'eventemitter2';

test('should build streams from event emitters', () => {

  const emitter = new EventEmitter2();

  const result = [];

  subscribe(x => result.push(x))(fromEvent(emitter, 'test'));

  emitter.emit('test', 1);
  emitter.emit('test', 2);

  expect(result).toEqual([1, 2]);

});

test('should not listen on events that were not subscribed to', () => {
  const emitter = new EventEmitter2();

  const result = [];

  subscribe(x => result.push(x))(fromEvent(emitter, 'test'));

  emitter.emit('notTest', 1);

  expect(result).toEqual([]);
});

test('should unsubscribe from event emitters on unsubscribe', () => {
  const emitter = new EventEmitter2();

  const subscription = subscribe()(fromEvent(emitter, 'test'));

  expect(emitter.listeners('test').length).toBe(1);

  subscription.unsubscribe();

  expect(emitter.listeners('test').length).toBe(0);

});

test('should subscribe to addEventListeners if present', () => {

  const emitter = new EventEmitter2();
  const result = [];

  emitter.addEventListener = emitter.on;
  emitter.removeEventListener = emitter.off;

  const subscription = subscribe(x => result.push(x))(fromEvent(emitter, 'test'));

  expect(1).toBe(emitter.listeners('test').length);

  emitter.emit('test', 1);
  emitter.emit('test', 2);
  emitter.emit('notTest', 3);

  expect(result).toEqual([1, 2]);

  subscription.unsubscribe();

  expect(0).toBe(emitter.listeners('test').length);

});