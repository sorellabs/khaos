/// fun.js --- Functional facilities
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

/// Module khaos.fun
//
// This module provides basic combinators for writing functional code in
// JavaScript.

var _slice = [].slice
  , node_p = 'process' in this


//// Function not
// Returns a new predicate that negates the given one.
//
// not :: Fun -> Fun -> Bool
function not(fun) {
  return function() {
    return !fun.apply(this, arguments) }}


//// Function partial
// Partially applies the given arguments to the function, yielding a new
// function.
//
// partial :: Fun, Any... -> Fun
function partial(fun) { var args
  args = _slice.call(arguments, 1)
  return function() {
    return fun.apply(this, args.concat(_slice.call(arguments))) }}


//// Function delay
// Executes the given function after, at least, the given seconds.
//
// delay :: Number, Fun -> Unspecified
function delay(seconds, fun) {
  return setTimeout(fun, seconds * 1000) }


//// Function defer
// Asynchronously executes the function as soon as possible.
//
// This should execute on the next event tick for Node.js and browsers
// that support the ``postMessage`` protocol. Otherwise, it'll rely on
// the setTimeout application, which can be "slow".
//
// defer :: Fun -> Undefined
function defer(fun) {
    node_p?            process.nextTick(fun)
  : deferred_timeout?  deffered_timeout(fun)
  : /* old engine? */  delay(0, fun) }

// Simulates a zero-timeout for browsers, using postMessage. Based on
// Mozilla's own David Baron code.
deferred_timeout = ('postMessage' in this) && function() {
  timeouts = []
  message  = 'khaos-deferred-application'

  window.addEventListener('message', handle_message, true)

  function handle_message(event) { var fun
    if (event.source == window && event.data == message) {
      event.stopPropagation()
      fun = timeouts.shift()
      fun && fun() }}

  return function(fun) {
    timeouts.push(fun)
    window.postMessage(message, '*') }
}()


//// Function compose
// Yields a new function that qpplies each function on order, passing
// the result of the previous computation over.
//
// compose :: Fun... -> Fun
function compose() { var funs, len
  funs = _slice.call(arguments)
  len  = funs.length
  return function Composition() { var result, args, i
    result = []
    args   = _slice.call(arguments)
    for (i = 0; i < len; ++i)
      result[0] = funs[i].apply(this, result.concat(args))

    return result[0] }}


//// - Exports
exports.not     = not
exports.partial = partial
exports.delay   = delay
exports.defer   = defer
exports.compose = compose