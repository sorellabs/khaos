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
//
// Generic sequence-like handling module.
//
// This module provides generic functionality for handling objects that
// match the `Sequence' interface, in an ad-hoc manner (objects are
// always coerced to Arrays internally).
//
// It should be noted that, due to the whole conversion-to-Array
// business, these functions are potentially dangerous with sequences
// that have lengths outside of the UInt32 range — [0..2³²[, — use them
// with caution around those, or don't use them at all!
//
// Generic manipulation for sequences is included in the `core' module
// of the `collection' package, which would be more appropriated for
// non-Array-bounded sequences.

//// -- Aliases --------------------------------------------------------
var __each          = [].forEach
var __push          = [].push
var __index_of      = [].indexOf
var __last_index_of = [].lastIndexOf
var __splice        = [].splice
var __reduce        = [].reduce
var __reduce_right  = [].reduceRight
var __every         = [].every
var __some          = [].some
var __filter        = [].filter
var __map           = [].map
var __slice         = [].slice
var __sort          = [].sort
var __reverse       = [].reverse
var __concat        = [].concat

var array_p         = Array.isArray
var copy            = slice



//// -- Iterating ------------------------------------------------------

///// Function each
// Applies the iterator function to each index/value pair in the
// sequence.
//
// each :: [a], (a, UInt32, [a] -> Any) -> Undefined
function each(sequence, iterator) {
  __each.call(sequence, iterator) }



//// -- Building -------------------------------------------------------

///// Function concatenate
// Returns a new sequence composed from the latter sequence appended to
// the first sequence.
//
// concatenate :: [a], [a]... -> [a]
function concatenate(sequence) {
  var i, len
  sequence = to_array(sequence)
  for (i = 1, len = arguments.length; i < len; ++i)
    sequence = sequence.concat(to_array(arguments[i]))

  return sequence

  function to_array(x){ return array_p(x)?      x
                        :      /* otherwise */  copy(x) }}

///// Function make
// Returns a new sequence of `n' items, possibly initialised to some
// `initial_value'.
//
// make :: Number, Any -> [a]
function make(size, initial_value) {
  var result = []
  while (size--)  result.push(initial_value)
  return result }



//// -- Manipulating ---------------------------------------------------

///// Function add
// Adds a value to the end of the sequence.
//
// add! :: [a]*, a -> [a]
function add(sequence, value) {
  __push.call(sequence, value)
  return sequence }


///// Function put
// Replaces the value at the given index by the given value.
//
// put! :: [a]*, UInt32, a -> [a]
function put(sequence, index, value) {
  Object(sequence)[index] = value
  return sequence }


///// Function remove
// Removes the item at the given index.
//
// remove! :: [a]*, UInt32 -> [a]
function remove(sequence, index) {
  __splice.call(sequence, index, 1)
  return sequence }


///// Function replace
// Replaces all the occurrences of `value' by the given replacement.
//
// replace! :: [a]*, a, a -> [a]
function replace(sequence, value, replacement) {
  var index
  do { index = __index_of.call(sequence, value)
       if (index != -1)  __splice.call(sequence, index, 1, replacement) }
  while (index != -1)

  return sequence }


///// Function insert
// Inserts a value at the given index, shifting items from there onwards
// to the right.
//
// insert! :: [a]*, UInt32. a -> [a]
function insert(sequence, index, value) {
  __splice.call(sequence, index, 0, value)
  return sequence }


///// Function clear
// Empties the sequence.
//
// clear! :: [a]* -> []
function clear(sequence) {
  array_p(sequence)?  sequence.length = 0
  : /* otherwise */   __splice.call(sequence, 0, sequence.length)

  return sequence }




//// -- Inspecting -----------------------------------------------------

///// Function at
// Returns the value at the given index.
//
// at :: [a], UInt32, default:a -> a
// at :: [a], UInt32 -> Maybe a
function at(sequence, index, _default) {
  sequence = Object(sequence)

  return index in sequence?  sequence[index]
  :      /* otherwise */     _default }


///// Function size
// Returns length of the sequence.
//
// Here `length' means the upper bounds of the sequence, it is not
// guaranteed that the sequence will have that many items, since a
// sequence can be sparse (have values only for some of the indexes in
// the range `0 ... length`).
//
// size :: [a] -> UInt32
function size(sequence) {
  return Math.max(0, Object(sequence).length) >>> 0 }


///// Function count
// Returns the number of times the predicate holds.
//
// count :: [a], (a, UInt32, [a] -> Bool) -> UInt32
function count(sequence, predicate) {
  return reduce(sequence, 0, function(result, value, index, array) {
                               return predicate(value, index, array)?  result + 1
                               :      /* otherwise */                  result })}


///// Function empty_p
// Is the sequence empty?
//
// Note that due to the potential sparse nature of sequences in
// JavaScript, we just check for the upper-bounds of the sequence. So,
// there's no guarantee that a non "empty" sequence will have any
// *actual* items defined. For that, use `some'.
//
// empty_p :: [a] -> Bool
function empty_p(sequence) {
  return !size(sequence) }


///// Function has_p
// Does the sequence have the given value?
//
// has_p :: [a], a -> Bool
function has_p(sequence, value) {
  return __index_of.call(sequence, value) != -1 }



//// -- Slicing --------------------------------------------------------

///// Function first
// Returns the first item of the sequence.
//
// first :: [a] -> Maybe a
function first(sequence) {
  return Object(sequence)[0] }


///// Function rest
// Returns a new sequence containing all but the first item.
//
// rest :: [a] -> [a]
function rest(sequence) {
  return slice(sequence, 1) }


///// Function last
// Returns the last item of the sequence.
//
// last :: [a] -> Maybe a
function last(sequence) {
  sequence = Object(sequence)
  return sequence[sequence.length - 1] }


///// Function but_last
// Returns a new sequence containing all but the last item.
//
// but_last :: [a] -> [a]
function but_last(sequence) {
  return slice(sequence, 0, -1) }


///// Function slice
// Returns a new sequence containing an arbitrary part of the original
// sequence.
//
// If either `start' or `end' are given negative indexes, the number is
// taken to be an offset from the end of the sequence.
//
// slice :: [a], Int32?, Int32? -> [a]
function slice(sequence, start, end) {
  return __slice.call(sequence, start, end) }


///// Function take
// Returns a part of the sequence, starting from the head up to the
// given size.
//
// take :: [a], UInt32 -> [a]
function take(sequence, size) {
  return slice(sequence, 0, size) }


///// Function drop
// Returns a part of the sequence, without the first N items.
//
// drop :: [a], UInt32 -> [a]
function drop(sequence, size) {
  return arguments.length == 1?  []
  :      /* otherwise */         slice(sequence, size) }


///// Function split
// Returns a sequence of sequences, by breaking the original sequence
// everytime the predicate holds.
//
// split :: [a], (a, UInt32, [a] -> Bool) -> [[a]]
function split(sequence, predicate) {
  return reduce(sequence, [[]], function(result, value, key) {
                                  if (predicate(value, key, sequence))
                                    result.push([])
                                  last(result).push(value)
                                  return result })}



//// -- Sorting --------------------------------------------------------

///// Function sorted
// Return a sorted sequence using the given ordering rules.
//
// sorted :: [a], (a, a -> Ordering) -> [a]
function sorted(sequence, sorter) {
  return __sort.call(copy(sequence), sorter) }

///// Function reversed
// Returns a sequence with the reverse order. That is, the last items
// will come first.
//
// reversed :: [a] -> [a]
function reversed(sequence) {
  return __reverse.call(copy(sequence)) }



//// -- Searching ------------------------------------------------------

///// Function find
// Returns the index of the first value to pass the predicate.
//
// find :: [a], (a, UInt32, [a] -> Bool) -> Maybe UInt32
function find(sequence, predicate) {
  var i, len
  sequence = Object(sequence)

  for (i = 0, len = sequence.length; i < len; ++i)
    if (i in sequence && predicate(sequence[i], i, sequence))
      return i

  return undefined }


///// Function find_last
// Returns the index of the last value to pass the predicate.
//
// find_last :: [a], (a, UInt32, [a] -> Bool) -> Maybe UInt32
function find_last(sequence, predicate) {
  var i
  sequence = Object(sequence)

  i = sequence.length
  while (i--)
    if (i in sequence && predicate(sequence[i], i, sequence))
      return i

  return undefined }



//// -- Folding --------------------------------------------------------

///// Function reduce
// Applies a function to each index/value pair in the sequence,
// returning the accumulated value.
//
// reduce :: [a], Any?, (Any, a, UInt32, [a] -> Any) -> Any
function reduce(sequence, value, folder) {
  return __reduce.call(sequence, folder, value) }


///// Function reduce_right
// Applies a function to each index/value pair in the sequence, from
// right to left, returning the accumulated value.
//
// reduce_right :: [a], Any?, (Any, a, UInt32, [a] -> Any) -> Any
function reduce_right(sequence, value, folder) {
  return __reduce_right.call(sequence, folder, value) }


///// Function every
// Does the predicate succeeds for every index/value pair in the
// sequence?
//
// every :: [a], (a, UInt32, [a] -> Bool) -> Bool
function every(sequence, predicate) {
  return __every.call(sequence, predicate) }


///// Function some
// Does the predicate succeeds for any index/value pair in the sequence?
//
// some :: [a], (a, UInt32, [a] -> Bool) -> Bool
function some(sequence, predicate) {
  return __some.call(sequence, predicate) }


///// Function filter
// Returns a new sequence, keeping only the items that pass the provided
// predicate.
//
// filter :: [a], (a, UInt32, [a] -> Bool) -> [a]
function filter(sequence, predicate) {
  return __filter.call(sequence, predicate) }


///// Function map
// Returns a new sequence, where each of the values in the sequence are
// transformed by the given mapper function. The ordering is maintained.
//
// map :: [a], (a, UInt32, [a] -> a) -> [a]
function map(sequence, functor) {
  return __map.call(sequence, functor) }



//// -- Exports --------------------------------------------------------
module.exports = { each         : each

                 , concatenate  : concatenate
                 , make         : make

                 , add          : add
                 , put          : put
                 , remove       : remove
                 , replace      : replace
                 , insert       : insert
                 , clear        : clear

                 , at           : at
                 , size         : size
                 , count        : count
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

                 , sorted       : sorted
                 , reversed     : reversed

                 , find         : find
                 , find_last    : find_last

                 , reduce       : reduce
                 , reduce_right : reduce_right
                 , every        : every
                 , some         : some
                 , filter       : filter
                 , map          : map
                 }
