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
var __each          = [].each
  , __push          = [].push
  , __index_of      = [].indexOf
  , __last_index_of = [].lastIndexOf
  , __splice        = [].splice
  , __reduce        = [].reduce
  , __reduce_right  = [].reduceRight
  , __every         = [].every
  , __some          = [].some
  , __filter        = [].filter
  , __map           = [].map
  , __slice         = [].slice
  , __sort          = [].sort
  , __reverse       = [].reverse
  , __concat        = [].concat

  , array_p         = Array.isArray
  , copy            = slice


//// - Traversable <| map
function each(sequence, iterator) {
  __each.call(sequence, iterator) }


//// - Building <| coll
function insert(sequence, index, value) {
  __splice.call(sequence, index, 0, value)
  return sequence }

function add(sequence, value) {
  __push.call(sequence, value) }

function replace(sequence, value, replacement) { var index
  do {
    index = find_first(sequence, value)
    if (index != -1)  __splice.call(sequence, index, 1, replacement) }
  while (index != -1)

  return sequence }

function concatenate(sequence, other_sequence) {
  return __concat.call(sequence, other_sequence) }

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

function remove(sequence, index) {
  __splice.call(sequence, index, 1)
  return sequence }


//// - Folding <| map
function reduce(sequence, value, folder) {
  return __reduce.call(sequence, folder, value) }

function reduce_right(sequence, value, folder) {
  return __reduce_right.call(sequence, folder, value) }

function every(sequence, predicate) {
  return __every.call(sequence, predicate) }

function some(sequence, predicate) {
  return __some.call(sequence, predicate) }

function filter(sequence, predicate) {
  return __filter.call(sequence, predicate) }

function map(sequence, predicate) {
  return __map.call(sequence, predicate) }


//// TODO: Set <| coll



//// - Inspection <| coll
function size(sequence) {
  return Object(sequence).length }

function empty_p(sequence) {
  return !size(sequence) }

function has_p(sequence, value) {
  return find_first(sequence, value) != -1 }


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
                                  if (predicate(value, key, sequence))
                                    result.push([])
                                  last(result).push(value) })}

//// - Sorting
function sort(sequence, sorter) {
  return __sort.call(sequence, sorter) }

function reverse(sequence) {
  return __reverse.call(copy(sequence)) }


//// - Searching
function find_first(sequence, value) {
  return __index_of.call(sequence, value) }

function find_last(sequence, value) {
  return __last_index_of.call(sequence, value) }


//// - Exports
module.exports = { each         : each
                 , insert       : insert
                 , concatenate  : concatenate
                 , add          : add
                 , replace      : replace
                 , clear        : clear
                 , at           : at
                 , put          : put
                 , remove       : remove
                 , reduce       : reduce
                 , reduce_right : reduce_right
                 , every        : every
                 , some         : some
                 , filter       : filter
                 , map          : map
                 , size         : size
                 , empty_p      : empty_p
                 , has_p        : has_p
                 , first        : first
                 , rest         : rest
                 , last         : last
                 , but_last     : but_last
                 , slice        : slice
                 , take         : take
                 , drop         : drop
                 , split        : split
                 , sort         : sort
                 , reverse      : reverse
                 , find_first   : find_first
                 , find_last    : find_last
                 }