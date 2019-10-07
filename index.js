const { nextTick } = process
class NanoQueue {
  constructor (limit, handlers = {}) {
    this.handlers = handlers
    this.limit = limit
    this.slots = 0
    this.queue = []
    this._enqueued = 0
    this._finished = 0
  }

  push (obj) {
    this.queue.push(obj)
    this._enqueued++
    this._work()
  }

  get progress () {
    return this._enqueued ? this._finished / this._enqueued : 1
  }

  reset () {
    this._enqueued = 0
    this._finished = 0
  }

  get remaining () {
    return this.slots + this.queue.length
  }

  _work () {
    if (this.slots < this.limit && this.queue.length) {
      const target = this.queue.shift()
      this.slots++
      nextTick(() => {
        this.handlers.process(target, () => {
          this.slots--
          this._finished++
          nextTick(this._work.bind(this))
        })
      })
    } else if (!this.remaining) {
      if (typeof this.handlers.oncomplete === 'function') this.handlers.oncomplete()
    }
  }
}
module.exports = NanoQueue
