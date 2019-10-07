const test = require('tape')
const NanoQueue = require('.')

test('Process 50 items using 3 slots', t => {
  let sum = 0
  const que = new NanoQueue(3, {
    process: (n, done) => {
      setTimeout(() => {
        sum += n
        done()
      }, Math.floor(Math.random() * 30 + 1))
    },
    oncomplete: () => {
      t.equal(sum, expectedSum)
      t.end()
    }
  })
  let expectedSum = 0
  for (let i = 0; i < 50; i++) {
    expectedSum += i
    que.push(i)
  }
  t.pass('All work enqueued')
})
