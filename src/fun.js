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


//// Function noop
// Does nothing
//
// noop :: () -> Undefined
function noop() { }



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
  : deferred_timeout?  deferred_timeout(fun)
  : /* old engine? */  delay(0, fun) }

// Simulates a zero-timeout for browsers, using postMessage. Based on
// Mozilla's own David Baron code.
var deferred_timeout = ('postMessage' in this) && function() {
  var timeouts, message
  timeouts = []
  message  = 'khaos-deferred-application'

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



//// Function compose
// Yields a new function that qpplies each function on order, passing
// the result of the previous computation over.
//
// compose :: Fun... -> Fun
function compose() {
  var funs, len
  funs = _slice.call(arguments)
  len  = funs.length

  return function _composition() {
    var result, i
    result = arguments
    for (i = 0; i < len; ++i)
      result = [funs[i].apply(this, result)]

    return result[0] }}


//// Function curry
// Creates a curried function, that returns the original function until
// all arguments are gathered.
//
// curry :: (Any... -> a) -> Any -> ... -> a
function curry(fun, initial_args) {
  var len = fun.length
  return function(arg) {
    var args = initial_args.concat([arg])

    return args.lenght < len?  curry(fun, args)
    :                          fun.apply(this, args) }}


//// Function uncurry
// Yields a function that takes a list of arguments, then applies those
// arguments to the wrapped function.
//
// uncurry :: (Any... -> a) -> [Any] -> a
function uncurry(fun) {
  return function _uncurried(args) {
    return fun.apply(args) }}


//// Function uncurry_bind
// Yields a function that takes a list of arguments, the first being the
// object the function should be applied to, the rest being the
// arguments to be passed to the function.
//
// uncurry_bind :: (Any... -> a) -> [Any] -> a
function uncurry_bind(fun) {
  return function _uncurried_bound(args) {
    return fun.call.apply(fun, args) }}


//// Function partial
// TODO: accept patterns for specialised partial application
//
// Partially applies the given arguments to the function, yielding a new
// function.
//
// partial :: (Any... -> a), Any... -> Any... -> a
function partial(fun) {
  var args = _slice.call(arguments, 1)
  return function _partial() {
    return fun.apply(this, args.concat(_slice.call(arguments))) }}



//// Function limit
// Higher-order function that limits the number of executions of the
// given function.
//
// limit :: (Any... -> a), Number -> Any... -> a
function limit(fun, times) {
  return function _limited() {
    if (!times) return

    --times
    return fun.apply(this, arguments) }}


//// Function once
// Convenience for limit(fun, 1).
//
// once :: (Any... -> a) -> Any... -> Maybe a
function once(fun) {
  return limit(fun, 1) }


//// Function until
// Higher-order function that turns the given function into a NOOP once
// the predicate doesn't hold.
//
// until :: (Any... -> a), (() -> Bool) -> Any... -> Maybe a
function until(fun, predicate) {
  return function _until() {
    if (!predicate()) fun = noop
    return fun.apply(this, arguments) }}


//// Function when
// Higher-order function that treats the given function as a NOOP until
// the predicate holds.
//
// when :: (Any... -> a), (() -> Bool) -> Any... -> Maybe a
function when(fun, predicate) {
  var f = noop
  return function _when() {
    if (predicate()) f = fun
    return f.apply(this, arguments) }}



//// Function constant
// The constant function.
//
// constant :: a -> () -> a
function constant(x) {
  return function Constant() {
    return x }}


//// Function identity
// The identity function.
//
// identity :: a -> a
function identity(x) {
  return x }


//// Function or
// Returns the value of the first truthy function.
//
// or :: (Any... -> a) -> Any... -> a
function or() {
  var funs, len
  funs = arguments
  len  = funs.length

  return function _or() {
    var i, result
    for (i = 0; i < len; ++i) {
      result = funs[i].apply(this, arguments)
      if (result) return result }}}


//// Function and
// Returns the value of the last truthy function, granted all the
// functions return a truthy value.
//
// and :: (Any... -> a) -> Any... -> a
function and() {
  var funs, len
  funs = arguments
  len  = funs.length

  return function _and() {
    var i, result
    for (i = 0; i < len; ++i) {
      result = funs[i].apply(this, arguments)
      if (!result) return false }

    return result }}


//// Function not
// Returns a new predicate that negates the given one.
//
// not :: Fun -> Any... -> Bool
function not(fun) {
  return function _not() {
    return !fun.apply(this, arguments) }}


//// - Exports
module.exports = { delay        : delay
                 , defer        : defer
                 , compose      : compose
                 , curry        : curry
                 , uncurry      : uncurry
                 , uncurry_bind : uncurry_bind
                 , partial      : partial
                 , limit        : limit
                 , once         : once
                 , until        : until
                 , when         : when
                 , constant     : constant
                 , identity     : identity
                 , or           : or
                 , and          : and
                 , not          : not

                 , internal     : { noop: noop }
                 }