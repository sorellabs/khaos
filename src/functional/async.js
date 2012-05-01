/// async.js --- Asynchronous utilities
//
// Copyright (c) 2012 Quildreen Motta
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

/// Module khaos.functional.async

//// -- Aliases --------------------------------------------------------
var slice  = [].slice
var node_p = 'process' in this



//// -- Public interface -----------------------------------------------

///// Function delay ///////////////////////////////////////////////////
// Executes the given function after (at least) the given seconds.
//
// delay :: Number, Fun -> TimerID
function delay(seconds, fun) {
  return setTimeout(fun, seconds * 1000) }


///// Function defer ///////////////////////////////////////////////////
// Asynchronously executes the function as soon as possible.
//
// This should execute on the next event tick for Node.js and browsers
// that support the `postMessage` protocol. Otherwise, it'll rely on
// the setTimeout application, which can be /"slow"/.
//
// defer :: Fun -> Undefined
function defer(fun) {
    node_p?            process.nextTick(fun)
  : deferred_timeout?  deferred_timeout(fun)
  : /* old engine? */  delay(0, fun) }


// Simulates a zero-timeout for browsers, using postMessage. Based on
// Mozilla's own David Baron code[1].
//
// [1]: http://dbaron.org/log/20100309-faster-timeouts
//
var deferred_timeout = ('postMessage' in this) && function() {
  var timeouts = []
  var message  = 'khaos-deferred-application'

  window.addEventListener('message', handle_message, true)

  function handle_message(event) {
    var fun
    if (event.source == window && event.data == message) {
      event.stopPropagation()
      fun = timeouts.shift()
      fun && fun() }}

  return function _defer(fun) {
           timeouts.push(fun)
           window.postMessage(message, '*') }
}()



//// -- Exports --------------------------------------------------------
module.exports = { delay: delay
                 , defer: defer }