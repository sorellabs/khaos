/// higher-order.js --- Higher order / wrapping utilities
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

/// Module khaos.functional.higher_order

//// -- Aliases --------------------------------------------------------
var slice = [].slice



//// -- Composition ----------------------------------------------------

///// Function compose /////////////////////////////////////////////////
// Yields a new function that applies each function in reverse order,
// passing the result of the previous computation over.
//
// compose :: Fun... -> Fun
function compose() {
  var funs = slice.call(arguments)
  var i    = funs.length

  return function _composition() {
           var result = arguments
           while (i--)
             result = [funs[i].apply(this, result)]

           return result[0] }}



//// -- Currying -------------------------------------------------------

///// Function curry ///////////////////////////////////////////////////
// Creates a curried function, that returns the original function until
// all arguments are gathered.
//
// curry :: Number?, (Any... -> a), [Any]? -> Any -> ... -> a
function curry(arity, fun, initial) {
  if (typeof arity == 'function') {
    initial = arguments[1]
    fun     = arity
    arity   = fun.length }

  return function _curried() {
           var args = (initial || []).concat(slice.call(arguments))

           return args.length < arity?  curry(arity, fun, args)
           :      /* otherwise */       fun.apply(this, args) }}



///// Function uncurry /////////////////////////////////////////////////
// Returns a function that takes a list of arguments, then applies those
// arguments to the wrapped function.
//
// uncurry :: (Any... -> a) -> [Any] -> a
function uncurry(fun) {
  return function _uncurried(args) {
           return fun.apply(args) }}


///// Function uncurry_bind ////////////////////////////////////////////
// Returns a function that takes a list of arguments, the first being
// the object the function should be applied to, the rest being the
// arguments to be passed to the function.
//
// uncurry_bind :: (Any... -> a) -> [Any] -> a
function uncurry_bind(fun) {
  return function _uncurried_bound(args) {
           return fun.call.apply(fun, args) }}


///// Function partial /////////////////////////////////////////////////
// TODO: accept patterns for specialised partial application
//
// Partially applies the given arguments to the function, returning a
// new function.
//
// partial :: (Any... -> a), Any... -> Any... -> a
function partial(fun) {
  var args = slice.call(arguments, 1)
  return function _partially_applied() {
           return fun.apply(this, args.concat(slice.call(arguments))) }}



//// -- Wrapping -------------------------------------------------------

///// Function wrap ////////////////////////////////////////////////////
// Returns a function that wraps the invocation of the given function.
//
// wrap :: Fun, (Fun -> a) -> a
function wrap(fun, wrapper) {
  return function _wrapped() {
           wrapper.apply(this, [fun].concat(slice.call(arguments))) }}



//// -- Exports --------------------------------------------------------
module.exports = { compose      : compose
                 , curry        : curry
                 , uncurry      : uncurry
                 , uncurry_bind : uncurry_bind
                 , partial      : partial
                 , wrap         : wrap }