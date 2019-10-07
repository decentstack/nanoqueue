# nanoqueue
A processing queue with workload limit

## Installation

```bash
npm i nanoqueue
```

## Usage

```js
const NanoQueue = require('nanoqueue')

let sum = 0

const queue = new NanoQueue(15, {
  // Process enqueue items, invoke `done' when done
  process: (n, done) => {
    setTimeout(() => {
      sum += n
      console.log(`Current progress: ${Math.floor(queue.progress * 100)}, ${queue.remaining} items remaining`)
      done()
    }, 50)
  },

  // Will be invoked every time queue.remaining reaches 0
  oncomplete: () => {
    console.log('All done')
  }

})

for (let i = 0; i < 100; i++) {
  queue.push(i)
}
```

## API

### class NanoQueue

**Properties**

- _ro_ `{Number} remaining` Amount of items that have not yet finished processing
- _ro_ `{Number} progress` Value between 0 and 1

#### Constructor

`new NanoQueue(nSlots, handlers)`

**Arguments**

- `{Number} nSlots` Number of active work slots.
- `{Object} handlers`
  - `{Function} process (item, done)` Invoked for enqueued item once a slot is free
  - _optional_ `{Function} oncomplete ()` Invoked whenever `remaining` becomes 0

**Description**

Creates a new NanoQueue instance with specified amount of work-slots.
The `process` handler is _required_ to be implemented and once invoked it must in turn
invoke the `done` callback to let the queue continue.

#### Function: push
`queue.push(item)`

**Description**

Enqueues `item`for processing

#### Function: reset

`queue.reset()`

**Description**

Resets processed/enqueued counters back to zero
