/// logic.js --- Operators for first-order/predicate logic
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

/// Module khaos.functional.logic



///// Function or //////////////////////////////////////////////////////
// Returns the value of the first truthy function.
//
// or :: (Any... -> a) -> Any... -> Maybe a
function or() {
  var funs = arguments
  var len  = funs.length

  return function _or() { var i, result
                          for (i = 0; i < len; ++i) {
                            result = funs[i].apply(this, arguments)

                            if (result) return result }}}


///// Function and /////////////////////////////////////////////////////
// Returns the value of the last truthy function, granted all the
// functions return a truthy value.
//
// and :: (Any... -> a) -> Any... -> Maybe a
function and() {
  var funs = arguments
  var len  = funs.length

  return function _and() { var i, result
                           for (i = 0; i < len; ++i) {
                             result = funs[i].apply(this, arguments)
                             if (!result) return }

                           return result }}


///// Function not /////////////////////////////////////////////////////
// Returns a new predicate that negates the given one.
//
// not :: Fun -> Any... -> Bool
function not(fun) {
  return function _not() { return !fun.apply(this, arguments) }}



//// -- Exports --------------------------------------------------------
module.exports = { or  : or
                 , and : and
                 , not : not }