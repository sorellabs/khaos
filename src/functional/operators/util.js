/// util.js --- Utilities for defining new operators
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

var slice = [].slice

function fold(xs, f, initial) {
  xs = slice.call(xs)
  return arguments.length > 2?  xs.reduce(f, initial)
  :      /* otherwise */        xs.reduce(f) }

function all(xs, f) {
  var len = xs.length
  xs = slice.call(xs)
  return xs.every(function(_, idx) { var a = xs[idx]
                                     var b = xs[idx + 1]

                                     return idx < len - 1?   f(a, b, idx, xs)
                                     :      /* otherwise */  true })}


module.exports = { fold: fold
                 , all:  all }