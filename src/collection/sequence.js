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

//// - Aliases
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


//// - Traversable
///// Function each
// Applies the iterator function to each index/value pair in the
// sequence.
//
// each :: [a], (e, UInt32, [a] -> Any) -> Undefined
function each(sequence, iterator) {
  __each.call(sequence, iterator) }



//// - Building
///// Function insert
// Inserts a value at the given index, shifting items from there onwards
// to the right.
//
// insert! :: [a], UInt32. a -> [a]
function insert(sequence, index, value) {
  __splice.call(sequence, index, 0, value)
  return sequence }

///// Function add
// Adds a value to the end of the sequence.
//
// add! :: [a], a -> [a]
function add(sequence, value) {
  __push.call(sequence, value)
  return sequence }

///// Function clear
// Empties the sequence.
//
// clear! :: [a] -> []
function clear(sequence) {
  array_p(sequence)?  sequence.length = 0
  :                   __splice.call(sequence, 0, sequence.length)
  return sequence }

///// Function concatenate
// Returns a new sequence composed from the latter sequence appended to
// the first sequence.
//
// concatenate :: [a], [a] -> [a]
function concatenate(sequence, other_sequence) {
  return __concat.call(sequence, other_sequence) }



//// - Manipulating
///// Function at
// Returns the value at the given index.
//
// at :: [a], UInt32, default:a -> a
// at :: [a], UInt32 -> Maybe a
function at(sequence, index, _default) {
  sequence = Object(sequence)

  return index in sequence?  sequence[index]
  :                          _default }

///// Function put
// Replaces the value at the given index by the given value.
//
// put! :: [a], UInt32, a -> a
function put(sequence, value, index) {
  Object(sequence)[index] = value
  return sequence }

///// Function replace
// Replaces all the occurrences of `value' by the given replacement.
//
// replace! :: [a], a, a -> [a]
function replace(sequence, value, replacement) { var index
  do {
    index = find(sequence, value)
    if (index != -1)  __splice.call(sequence, index, 1, replacement) }
  while (index != -1)

  return sequence }

///// Function remove
// Removes the item at the given index.
//
// remove! :: [a], UInt32 -> [a]
function remove(sequence, index) {
  __splice.call(sequence, index, 1)
  return sequence }


//// - Folding
///// Function reduce
// Applies a function to each index/value pair in the sequence,
// returning the accumulated value.
//
// reduce :: [a], Any, (Any, a -> Any) -> Any
// reduce :: [a], (Any, a -> Any) -> Any
function reduce(sequence, value, folder) {
  return __reduce.call(sequence, folder, value) }

///// Function reduce_right
// Applies a function to each index/value pair in the sequence, from
// right to left, returning the accumulated value.
//
// reduce_right :: [a], Any, (Any, a -> Any) -> Any
// reduce_right :: [a], (Any, a -> Any) -> Any
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
function map(sequence, predicate) {
  return __map.call(sequence, predicate) }



//// TODO: Set



//// - Inspection
///// Function size
// Returns length of the sequence.
//
// Here `length' means the upper bounds of the sequence, it is not
// guaranteed that the sequence will have that many items, since a
// sequence can be sparse (have values only for some of the indexes in
// the range 0 ... length).
//
// size :: [a] -> UInt32
function size(sequence) {
  return Object(sequence).length }

///// Function empty_p
// Is the sequence empty?
//
// Note that due to the potential sparse nature of sequences in
// JavaScript, we just check for the upper-bounds of the sequence. So,
// there's no guarantee that a non "empty" sequence will have any
// *actual* items defined. For that, use `count'.
//
// empty_p :: [a] -> Bool
function empty_p(sequence) {
  return !size(sequence) }

///// Function has_p
// Does the sequence have the given value?
//
// has_p :: [a], a -> Bool
function has_p(sequence, value) {
  return find(sequence, value) != -1 }


//// - Slicing
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
// slice :: [a], Int32, ? Int32 -> [a]
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
  return slice(sequence, size) }

///// Function split
// Returns a sequence of sequences, by breaking the original sequence
// everytime the predicate holds.
//
// split :: [a], (a, UInt32, [a] -> Bool) -> [[a]]
function split(sequence, predicate) {
  return reduce(sequence, [[]], function(result, value, key) {
                                  if (predicate(value, key, sequence))
                                    result.push([])
                                  last(result).push(value) })}

//// - Sorting
///// Function sort
// Sorts the sequence using the given sorter.
//
// sort! :: [a], (a, a -> Ordering) -> [a]
function sort(sequence, sorter) {
  return __sort.call(sequence, sorter) }

///// Function reverse
// Returns a sequence with the reverse order. That is, the last items
// will come first.
//
// reverse! :: [a] -> [a]
function reverse(sequence) {
  return __reverse.call(copy(sequence)) }


//// - Searching
///// Function find
// Returns the index of the first value to match, by a strict equality
// test, or -1 if not found.
//
// find :: [a], (a, UInt32, [a] -> Bool) -> Maybe UInt32
function find(sequence, predicate) {
  var result = undefined
  some(sequence, function(value, key) {
    return predicate(value, key, sequence)?  (result = key, true)
    :                                        false })

  return result }


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
                 , find         : find
                 }