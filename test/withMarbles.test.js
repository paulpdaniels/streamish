
import {withMarbles} from "./helpers/withMarbles";
import {Record} from "../src/stream/operators/notification";

const {next, error, complete} = Record;

test('should generate events using string keys', () => {

  const subscriber = jest.fn();
  const marble = 'abcd#|';

  withMarbles(subscriber)(marble);

  expect(subscriber).toBeCalledWith(
    next(0, 'a'),
    next(10, 'b'),
    next(20, 'c'),
    next(30, 'd'),
    error(40, 42),
    complete(50)
  )

});

test('should pass through non-marbles', () => {

  const marble = [next(10, 'a'), error(15, 42), complete(20)];
  const subscriber = jest.fn();

  withMarbles(subscriber)(...marble);

  expect(subscriber).toBeCalledWith(
    ...marble
  )

});

test('should throw on invalid marbles', () => {

  expect(() => withMarbles(() => {})('((')).toThrow();
  expect(() => withMarbles(() => {})(')')).toThrow();

});