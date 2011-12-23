/// iterator.js --- provides basic iterators/generators
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

/// Module khaos.collection.iterator
var type = require('../type')

var callable_p  = type.callable_p
var array_p     = type.array_p
var string_p    = type.string_p
var number_p    = type.number_p
var primitive_p = type.primitive_p


var sequence_type = { SPARSE: 0
                    , TIGHT:  1 }

function raise(err) { throw err }


function iteration_unsuported(value) {
  return new TypeError('Type "' + type.name(value) + '" is not Iterable') }


function iterable_p(value) {
  return value
  &&     typeof value.iterate == 'function' }


function iterate(value) {
  return callable_p(value)?    value
  :      iterable_p(value)?    value.iterate()
  :      array_p(value)?       sequence_iterator(value)
  :      string_p(value)?      sequence_iterator(value, sequence_type.TIGHT)
  :      number_p(value)?      range_iterator(value)
  :      !primitive_p(value)?  object_iterator(value)
  :      /* otherwise */       raise( iteration_unsuported(value) ) }


function sequence_iterator(array, distribution) {
  var index, length
  index  = 0
  sparse = distribution !== sequence_type.TIGHT
  length = array.length

  return function Iterator(callback, done) {
    if (index >= length)  done()
    else {
      callback(array[index], index, array)
      index = next_index() }}

  function next_index() {
    var i
    i = index + 1
    if (sparse)
      while (i < length && !(i in array))  ++i

    return i }}


function object_iterator(object) {
  var keys, index, length
  keys   = Object.keys(object)
  length = keys.length
  index  = 0

  return function Iterator(callback, done) {
    var key
    key = keys[index]

    if (index >= length)  done()
    else {
      callback(object[key], key, object)
      ++index }}}


function range_iterator(start, end, step) {
  if (arguments.length == 1)  end = start, start = 0

  start = +start || 0
  end   = +end   || Infinity
  step  = +step  || 1

  return function Iterator(callback, done) {
    if (start >= end)  done()
    else {
      callback(start)
      start += step }}}


exports.sequence_type     = sequence_type
exports.sequence_iterator = sequence_iterator
exports.object_iterator   = object_iterator
exports.range_iterator    = range_iterator
exports.iterate           = iterate