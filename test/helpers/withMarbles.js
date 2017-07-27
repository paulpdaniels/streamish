
import { Record } from "../../src/stream/operators/notification";
import _identity from "../../src/stream/operators/internal/_identity";

export function withMarbles(subscriber) {
  return (head, ...rest) => {
    let expected;
    if (typeof head === 'string') {
      expected = parseMarbles(head, ...rest);
    } else {
      expected = [head, ...rest];
    }
    return subscriber(...expected);
  }
}

function parseMarbles(marbles, ...args) {
  let [mapMarblesToObject = _identity, mapMarblesToException = () => 42, timeUnit = 10] = args;

  if (typeof mapMarblesToObject !== 'function') {
    const mapperObj = mapMarblesToObject;
    mapMarblesToObject = item => mapperObj[item];
  }

  if (typeof mapMarblesToException !== 'function') {
    const mapperObj = mapMarblesToException;
    mapMarblesToException = () => mapperObj;
  }

  let currentTime = 0;
  let suspended = false;
  const expected = [];
  for (let marble of marbles) {
    switch (marble) {
      case ' ':
        continue;
      case '-':
        currentTime += timeUnit;
        break;
      case '(':
        if (suspended) throw new Error('Invalid marble can\'t have nested parenthesis');
        suspended = true;
        break;
      case ')':
        if (!suspended) throw new Error('Unmatched \')\' detected!');
        suspended = false;
        currentTime += timeUnit;
        break;
      case '#':
        expected.push(Record.error(currentTime, mapMarblesToException()));
        !suspended && (currentTime += timeUnit);
        break;
      case '|':
        expected.push(Record.complete(currentTime));
        !suspended && (currentTime += timeUnit);
        break;
      default:
        expected.push(Record.next(currentTime,
          mapMarblesToObject(marble)
        ));
        !suspended && (currentTime += timeUnit);
    }
  }

  return expected;
}