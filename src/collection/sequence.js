/// sequence.js --- Sequence handling
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

/// Module khaos.collection.sequence
var __each     = [].each
  , __push     = [].push
  , __index_of = [].indexOf
  , __splice   = [].splice
  , __reduce   = [].reduce
  , __every    = [].every
  , __some     = [].some
  , __filter   = [].filter
  , __map      = [].map
  , __slice    = [].slice
  , __sort     = [].sort
  , __reverse  = [].reverse

  , array_p    = Array.isArray
  , copy       = slice


//// - Traversable <| map
function each(sequence, iterator) {
  __each.call(sequence, iterator) }


//// - Building <| coll
function add(sequence, value) {
  __push.call(sequence, value) }

function remove(sequence, value) { var index
  index = __index_of.call(sequence, value)
  if (index != -1)
    __splice.call(sequence, index, 1)
  return sequence }

function replace(sequence, value, replacement) { var index
  index = __index_of.call(sequence, value)
  if (index != -1)
    __splice.call(sequence, index, 1, replacement)
  return sequence }

function clear(sequence) {
  array_p(sequence)?  sequence.length = 0
  :                   __splice.call(sequence, 0, sequence.length)
  return sequence }


//// - Manipulating <| map
function at(sequence, index) {
  return Object(sequence)[index] }

function put(sequence, value, index) {
  Object(sequence)[index] = value
  return sequence }

function remove_at(sequence, index) {
  __splice.call(sequence, index, 1)
  return sequence }


//// - Folding <| map
function reduce(sequence, value, folder) {
  return __reduce.call(sequence, folder, value) }

function every(sequence, predicate) {
  return __every.call(sequence, predicate) }

function some(sequence, predicate) {
  return __some.call(sequence, predicate) }

function filter(sequence, predicate) {
  return __filter.call(sequence, predicate) }

function map(sequence, predicate) {
  return __map.call(sequence, predicate) }


//// - Set <| coll


//// - Inspection <| coll
function size(sequence) {
  return Object(sequence).length }

function empty_p(sequence) {
  return !size(sequence) }

function has_p(sequence, value) {
  return __index_of.call(sequence, value) != -1 }


//// - Slicing
function first(sequence) {
  return Object(sequence)[0] }

function rest(sequence) {
  return slice(sequence, 1) }

function last(sequence) {
  sequence = Object(sequence)
  return sequence[sequence.length - 1] }

function but_last(sequence) {
  return slice(sequence, 0, -1) }

function slice(sequence, start, end) {
  return __slice.call(sequence, start, end) }

function take(sequence, size) {
  return slice(sequence, 0, size) }

function drop(sequence, size) {
  return slice(sequence, size) }

function split(sequence, predicate) {
  return reduce(sequence, [[]], function(result, value, key) {
                                  if (should_split_p(value, key))
                                    result.push([])
                                  last(result).push(value) })

  function should_split_p(value, key) {
    return predicate(value, key, sequence) }}


//// - Sorting
function sort(sequence, sorter) {
  return __sort.call(sequence, sorter) }

function reverse(sequence) {
  return __reverse.call(copy(sequence)) }


//// - Searching
//// - Stack
//// - Queue

//// - Exports
module.exports = { each      : each
                 , add       : add
                 , remove    : remove
                 , replace   : replace
                 , clear     : clear
                 , at        : at
                 , put       : put
                 , remove_at : remove_at
                 , reduce    : reduce
                 , every     : every
                 , some      : some
                 , filter    : filter
                 , map       : map
                 , size      : size
                 , empty_p   : empty_p
                 , has_p     : has_p
                 , first     : first
                 , rest      : rest
                 , last      : last
                 , but_last  : but_last
                 , slice     : slice
                 , take      : take
                 , drop      : drop
                 , split     : split
                 , sort      : sort
                 , reverse   : reverse
                 }