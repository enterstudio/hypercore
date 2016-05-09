var tape = require('tape')
var memdb = require('memdb')
var ram = require('random-access-memory')
var concat = require('concat-stream')
var hypercore = require('../')

tape('createWriteStream to createReadStream', function (t) {
  t.plan(1)
  var core1 = create()
  var core2 = create()

  var w = core1.createWriteStream()
  w.end('hello')

  var r = core2.createReadStream(w.publicId)
  r.pipe(concat(function (body) {
    t.deepEqual(body.toString(), 'hello')
  }))
  replicate(w.feed, r.feed)
})

function replicate (a, b) {
  var stream = a.replicate()
  stream.pipe(b.replicate()).pipe(stream)
}

function create () {
  return hypercore(memdb())
}
