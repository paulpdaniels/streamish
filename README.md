# streamish
A simple Functional Reactive Streaming library

[![CircleCI](https://img.shields.io/circleci/project/github/paulpdaniels/streamish.svg)](https://github.com/paulpdaniels/streamish)
[![Codecov](https://img.shields.io/codecov/c/github/paulpdaniels/streamish.svg)](https://github.com/paulpdaniels/streamish)
[![npm](https://img.shields.io/npm/v/streamish.svg)](https://www.npmjs.com/package/streamish)
[![npm](https://img.shields.io/npm/l/streamish.svg)]()
[![David](https://img.shields.io/david/paulpdaniels/streamish.svg)]()
[![David](https://img.shields.io/david/dev/paulpdaniels/streamish.svg)]()

#### Install

```bash

npm install --save streamish

```

## Warning! Work in progress!

This is currently a work in progress and more what I would consider to be an "experiment" than anything else. If you want a production ready system I would suggest checking out RxJS, XStreams, Most.js or Bacon.

If you want to help out and contribute I would greatly appreciate that too.

#### Why another library?

The goal of this project is to be as modular as possible, so to that end I am not following what has become the standard in Reactive Programming libraries and making everything fluent. It is a useful pattern, and in the future I may add a module to do it if it can be done well, but my main goal with this library is both to learn a little more about the topic by creating a library from scratch and to make operators shippable similar to how `lodash` ships.


### Getting started

The versatility of this library is in the flexibility with which you can define operations.

```javascript

import {subscribe, Stream, fromEvent, fromTimer, delay, pipe, filter, map} from 'streamish';

// Declare a sink which receives values
const consoleSink = subscribe(
  value => console.log(value)
);

// Declare a stream which emits values
const streamFromArray = Stream([1, 2, 3, 4]);
const streamFromIterable = Stream('streams are fun!');
const streamFromPromise = Stream(Promise.resolve(42));
const streamFromOtherObservables = Stream(Rx.Observable.timer(2000));

// Or use a factory method
const streamFromEvent = fromEvent(window, 'click');
const streamFromTimer = fromTimer(2000);

// Build some logic
const pipeline = pipe(
  filter(x => x % 2 == 0),
  map(x => x * 2),
  delay(100)
);


// Compose that logic

// Stream + operators = Stream
const augmentedStream = pipeline(streamFromArray)

// Operators + Operators = Operator
const convertCharsPipeline = map(ch => ch.charCodeAt(0));

// Now can convert to numbers
const augmentedPipeline = pipe(convertCharsPipeline, pipeline);

// Operators + Subscribe = Streamish

// Will go live as soon as it is subscribed to
const subscribedPipeline = pipe(pipeline, consoleSink);

//i.e. subscribedPipeline(streamFromPromise);


```

#### More on style

Regardless of the style, operators will be imported as modules and composed together.

```javascript
const Stream = require('streamish/Stream');
const map = require('streamish/operators/map');
const subscribe = require('streamish/operators/subscribe');

subscribe(next => console.log('Value: ' + next))(map(a => a * a)(Stream([1, 2, 3, 4])));
```

Now you may be saying to yourself, well that isn't particularly readable, so I'll stick to my fluent operators thank you very much.

But wait there is more!
```javascript

const pipe = require('streamish/operators/pipe');

pipe(
 map(a => a * a),
 subscribe(next => console.log('Value: ' + next)
)(Stream([1, 2, 3, 4]);

```

If that looks familiar to you, Congratulations! You have probably used something like `Ramda` before which is where most of this library got its inspiration, in fact the design of `pipe` and its sibling `compose` are compatible with signatures from Ramda (*mostly*), and hopefully soon the FantasyLand Spec.

#### Anatomy of an operator

The operators in Streamish all use a very common functional concept known as function currying. Without getting too much into the weeds of functional programming, currying is just a way of breaking up arguments that are passed to a function. They create what is referred to as a thunk which is a function that when called returns another function. As such every operator that you will encounter will be of the shape:

```javascript

const someOperator = (...args) => (flow: Flow, scheduler: Scheduler) => Flow

// Subscribe is a little special because it has a different return value
const subscribeLike = (...args) => (flow: Flow, scheduler: Scheduler) => Subscription

```

Why do we do this? For one, it makes it much easier to combine operators because be push the operator specific stuff into the first functions arguments. The function that we get back from the initial call always has the same interface. This is what enables the functional chaining between operators. And it also allows us to do something that isn't normally possible which is *schedule everywhere*. Because fundamentally every operator passes along a reference to the scheduler that was passed into it, it is available to every internal operator that we subsequently call. 

** TODO ** Define opt-out behavior of using scheduler pass-through.

#### Why is suscribe an operator too?

Well quite simply because it makes sense. The Streams in this library are meant to be the bare metal requirement that fulfills the TC39 Observable specification, and would technically make them interoperable with other Observable libraries. By packaging `subscribe` as its own operator we can also do some other cool things.

Let's look first at what the standard Stream subscribe signature looks like:

```javascript

const subscription = Stream([1, 2, 3, 4]).subscribe({
  next: x => console.log(x),
  error: e => console.log(e),
  complete: () => console.log('Done')
});

```

Using the raw Observable (or `Flow` as we call it in this library) requires a fully functional Observer. Why? Because this lets us build other capabilities on top of it. Basically using the raw form requires that the `Observer` be well formed, because it prevents us from having to do a bunch of other object creation under the covers to make your Observer into a proper Observer. If we allow `subscribe` to exist in its own right, then we can allow library consumers, or other libraries to define the kind of assumptions they want to be able to make about Observers.

Thus we could easily define a "safe" subscribe method which handles various conversion logic and creates a specific type of `Sink`.

```javascript

// A different subscribe method!
const subscribe = require('otherLibrary/operators/safeSubscribe');

pipe(
 map(a => a * a),
 subscribe(next => console.log('Value: ' + next)
)(Stream([1, 2, 3, 4]);

```

Notice that we were able to swap the module **in place** because the subscribe is not linked to the `Observable` itself.

#### Previous Work

- [RxJS](https://github.com/ReactiveX/rxjs/)
- [Most](https://github.com/cujojs/most)
- [XStream](https://github.com/staltz/xstream)
- [Kefir](https://rpominov.github.io/kefir/#)
- [Bacon](https://baconjs.github.io/)





