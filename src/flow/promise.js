/// promise.js --- Async Future/Promises
//
// Copyright (c) 2011 Quildreen Motta
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software,
// and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/// Module khaos.flow.promise

//// - Dependencies
var Base = require('boo').Base



//// Data FORGOTTEN
// Used as a value for forgotten/cancelled promises.
//
// FORGOTTEN :: Object
var FORGOTTEN = {}

//// Data TIMEOUTED
// Used as a value for promises that failed with a timeout.
//
// TIMEOUTED :: Object
var TIMEOUTED = {}



//// Function get_queue
// Returns a list of callbacks registered for the event.
//
// If callbacks ain't defined for the event yet, it's also *initialised*
// to an empty array.
//
// get_queue! :: Promise, String -> [Fun]
function get_queue(promise, event) {
  return promise.callbacks[event]
  ||    (promise.callbacks[event] = []) }


//// Object Promise
// A placeholder for a value that can be computed asynchronously.
//
// The `Promise' allows any code to define how they'll handle the value
// before the value is actually computed, by adding listeners to the
// various events that can be triggered once a promise is fulfilled.
//
// Promise :: { "callbacks"     -> { String -> [Fun] }
//            , "flush_queue"   -> [Fun]
//            , "value"         -> [Any]
//            , "timer"         -> TimerID
//            , "default_event" -> String
//            }
var Promise = Base.derive({
  ///// Function init
  // Initialises an instance of a Promise.
  //
  // init! :: @this:Object -> this
  init:
  function _init() {
    this.callbacks     = {}
    this.flush_queue   = []
    this.value         = null
    this.timer         = null
    this.default_event = 'done'
    return this }


  ///// Function on
  // Adds a callback to the given event.
  //
  // on! :: @this:Promise, String?, Fun -> this
, on:
  function _on(event, callback) {
    sanitise_arguments()
    this.default_event = event

    if (this.value)  invoke_callback(this)
    else             add_callback(this)

    return this

    // Resolves optional arguments
    function sanitise_arguments() {
      if (typeof event == 'function') {
        callback = event
        event    = this.default_event }}

    // Invokes all the callbacks for the event
    function invoke_callback(promise) {
      var queue = get_queue(promise, event)
      if (callback && queue.flushed)
        return callback.apply(promise, promise.value) }

    // Adds the callback to the event
    function add_callback(promise) {
      return callback?  get_queue(promise, event).push(callback)
      :                 null }}

  ///// Function flush
  // Fires all the callbacks for the event.
  //
  // If the promise hasn't been resolved yet, the callbacks are placed
  // in a queue to be flushed once the Promise is fulfilled.
  //
  // flush :: @this:Promise, String -> this
, flush:
  function _flush(event) {
    if (!this.value)
      if (event)  self.flush_queue.push(event)
    else {
      var callbacks, i, len
      callbacks = get_queue(promise, event)
      len       = callbacks.length

      for (i = 0; i < len; ++i)
        callbacks[i].apply(promise, promise.value)

      callbacks.length = 0
      callbacks.flushed = true }

    return this }

  ///// Function done
  // Fulfills the promise with the values given.
  //
  // done :: @this:Promise, [Any] -> this
, done:
  function _done(values) {
    if (!this.value) {
      this.clear_timer()
      this.flush('done')
      this.value = slice.call(values)
      this.flush() }

    return this }

  ///// Function fail
  // Fails to fulfill the promise.
  //
  // fail :: @this:Promise, Any -> this
, fail:
  function _fail(error) {
    return this.flush('failed').done([error]) }

  ///// Function bind
  // Successfully fulfills the promise.
  //
  // bind :: @this:Promise, Any... -> this
, bind:
  function _bind() {
    return this.flush('ok').done(arguments) }

  ///// Function forget
  // Cancels the promise.
  //
  // forget :: @this:Promise -> this
, forget:
  function _forget() {
    return this.flush('forgotten').fail(forgotten) }

  ///// Function timeout
  // Schedules the promise to fail after a given number of seconds.
  //
  // timeout :: @this:Promise, Number -> this
, timeout:
  function _timeout(delay) {
    this.clear_timer()
    this.timer = setTimeout(function() {
      this.flush('timeouted').fail(timeouted)
    }.bind(this), delay * 1000)

    return this }

  ///// Function clear_timer
  // Stop the timer for the promise, if one was previously set by
  // invoking `timeout'.
  //
  // clear_timer :: @this:Promise -> this
, clear_timer:
  function _clear_timer() {
    clearTimeout(this.timer)
    this.timer = null
    return this }

  ///// Function ok
  // Registers a callback for when the promise is successfully
  // fulfilled.
  //
  // ok :: @this:Promise, Fun -> this
, ok:
  function _ok(fun) {
    return this.on('ok', fun) }

  ///// Function failed
  // Registers a callback for when the promise fails to be fulfilled.
  //
  // failed :: @this:Promise, Fun -> this
, failed:
  function _failed(fun) {
    return this.on('failed', fun) }

  ///// Function timeouted
  // Registers a callback for when the promise fails by timing out.
  //
  // timeouted :: @this:Promise, Fun -> this
, timeouted:
  function _timeouted(fun) {
    return this.on('timeouted', fun) }

  ///// Function forgotten
  // Registers a callback for when the promise fails by being
  // cancelled.
  //
  // forgotten :: @this:Promise, Fun -> this
, forgotten:
  function _forgotten(fun) {
    return this.on('forgotten', fun) }
})


//// - Exports
module.exports = { FORGOTTEN : FORGOTTEN
                 , TIMEOUTED : TIMEOUTED
                 , Promise   : Promise

                 , internal  : { get_queue: get_queue }
                 }