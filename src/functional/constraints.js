/// constraints.js --- Constraints for function application
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

/// Module khaos.functional.constraints



//// -- Helpers --------------------------------------------------------
function noop() { }



//// -- General constraints --------------------------------------------

///// Function limit ///////////////////////////////////////////////////
// Higher-order function that limits the number of executions of the
// given function.
//
// limit :: Number, (Any... -> a) -> Any... -> a
function limit(times, fun) {
  return function _limited() { if (!times) return

                               --times
                               return fun.apply(this, arguments) }}


///// Function once ////////////////////////////////////////////////////
// :convenience: limit(fun, 1)
//
// once :: (Any... -> a) -> Any... -> Maybe a
function once(fun) { return limit(fun, 1) }


///// Function until ///////////////////////////////////////////////////
// Higher-order function that turns the given function into a NOOP once
// the predicate doesn't hold.
//
// until :: (() -> Bool), (Any... -> a) -> Any... -> Maybe a
function until(predicate, fun) {
  return function _until() { if (!predicate()) fun = noop
                             return fun.apply(this, arguments) }}


///// Function when ////////////////////////////////////////////////////
// Higher-order function that treats the given function as a NOOP until
// the predicate holds.
//
// when :: (() -> Bool), (Any... -> a) -> Any... -> Maybe a
function when(predicate, fun) {
  var f = noop
  return function _when() { if (predicate()) f = fun
                            return f.apply(this, arguments) }}



//// -- Exports --------------------------------------------------------
module.exports = { limit : limit
                 , once  : once
                 , until : until
                 , when  : when }