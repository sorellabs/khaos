/// map.js --- Associative collection handling
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

/// Module khaos.collection.map
//
// Provides services to work with objects as Maps, from `String' to
// `Any' kind of data.
//
// This includes basic traversing, manipulation, inspection,
// decomposition (getting keys, values or both from a Map) and the basic
// folding operations.
//
// There are a few things worth noting when working with this library:
//
// First, all functions that do something with the set of keys or set of
// values in an map, do so *at the map object level*. That is, they
// don't bother with the objects such a map delegates to — no messing
// with things in the prototype chain.
//
// Second, All of the pure functions that return a new Map in this
// module are extremely dangerous — they don't copy non-enumerable
// properties. This is per-design, as the library is to be compatible
// with ES3 environments, which don't provide any ways to list
// non-enumerable properties in an object.
//
// Another thing to keep in mind is that all pure functions do *only* a
// shallow clone of the object, such that any structural changes won't
// be noticed in other things that refer to those nested objects. Some
// of the functions do no cloning at all (reduce), and just expect the
// given callback function to not mutate the original object. Wishful
// thinking all the way.
//

//// -- Aliases --------------------------------------------------------
var _keys        = Object.keys
var clone        = Object.create
var proto        = Object.getPrototypeOf
var has_own_prop = {}.hasOwnProperty



//// -- Traversing -----------------------------------------------------

///// Function each
// Applies the iterator function to each key/value pair in the map.
//
// each :: {k -> e}, (e, k, {k -> e} -> Ignored) -> Undefined
function each(map, iterator) {
  var i, len
  var props = keys(map)
  for (i = 0, len = props.length; i < len; ++i)
    iterator(map[props[i]], props[i], map) }



//// -- Manipulation ---------------------------------------------------

///// Function put
// Assigns a value for the given key.
//
// put! :: {k -> e}*, k, e -> {k -> e}
function put(map, key, value) {
  Object(map)[key] = value
  return map }


///// Function remove
// Removes the given key and its associated value from the map.
//
// remove! :: {k -> e}*, k -> {k -> e}
function remove(map, key) {
  delete Object(map)[key]
  return map }


///// Function replace
// Replaces all the occurrences of `value' by the given `replacement'.
//
// This only replaces values that are directly set in the map
// itself.
//
// replace! :: {k -> e}*, e, e -> {k -> e}
function replace(map, value, replacement) {
  var key
  map = Object(map)
  for (key in map)
    if (has_key_p(map, key) && map[key] === value)
      map[key] = replacement

  return map }


///// Function clear
// Removes all key/value pairs from the map.
//
// clear! :: {k -> e}* -> {}
function clear(map) {
  each(map, function(value, key){
              delete map[key] })
  return map }



//// -- Inspection -----------------------------------------------------

///// Function at
// Retrieves the value for the given key.
//
// at :: {k -> e}, k, default:e -> e
// at :: {k -> e}, k -> Maybe e
function at(map, key, _default) {
  map = Object(map)

  return key in map?      map[key]
  :      /* otherwise */  _default }


///// Function size
// Returns the number of key/value pairs in the map.
//
// size :: {k -> e} -> Number
function size(map) {
  return keys(map).length }


///// Function empty_p
// Does the map have any key/value pairs?
//
// empty_p :: {k -> e} -> Bool
function empty_p(map) {
  return !size(map) }


///// Function has_key_p
// Does the map have the given key?
//
// has_key_p :: {k -> e}, k -> Bool
function has_key_p(map, key) {
  return map != null?     has_own_prop.call(map, key)
  :      /* otherwise */  false }



//// -- Decomposition --------------------------------------------------

///// Function keys
// Extracts the keys from the given map.
//
// keys :: {k -> e} -> [k]
function keys(map) {
  return _keys(Object(map)) }


///// Function values
// Extracts the values from the given map.
//
// values :: {k -> e} -> [e]
function values(map) {
  return reduce(map, [], function(result, item, key) {
                           result.push(item)
                           return result })}

///// Function items
// Extracts the key/value pairs from the given map.
//
// items :: {k -> e} -> [(k, e)]
function items(map) {
  return reduce(map, [], function(result, item, key) {
                           result.push([key, item])
                           return result })}



//// -- Folding --------------------------------------------------------

///// Function reduce
// Applies a function to each key/value pair in the map, returning the
// accumulated value.
//
// reduce :: {k -> e}, Any?, (Any, e, k, {k -> e} -> Any) -> Any
function reduce(map, value, folder) {
  var props, i, len
  map   = Object(map)
  props = keys(map)
  if (arguments.length == 2) {
    folder = value
    value  = map[props.shift()] }

  for (i = 0, len = props.length; i < len; ++i)
    value = folder(value, map[props[i]], props[i], map)

  return value }


///// Function every
// Does the predicate succeeds for each key/value pair in the map?
//
// every :: {k -> e}, (e, k, {k -> e} -> Bool) -> Bool
function every(map, predicate) {
  var i, props
  map   = Object(map)
  props = keys(map)
  i     = props.length
  while (i--)
    if (!predicate(map[props[i]], props[i], map))  return false
  return true }


///// Function some
// Does the predicate succeeds for any key/value pair in the map?
//
// some :: {k -> e}, (e, k, {k -> e} -> Bool) -> Bool
function some(map, predicate) {
  var i, props
  map   = Object(map)
  props = keys(map)
  i     = props.length
  while (i--)
    if (predicate(map[props[i]], props[i], map))  return true
  return false }


///// Function filter
// Yields a new map keeping only the own properties that pass the given
// filter.
//
// The map's prototype chain is maintained, but non-enumerable
// properties are discarded.
//
// filter :: {k -> e}, (e, k, {k -> e} -> Bool) -> {k -> e}
function filter(map, predicate) {
  var key
  var props  = keys(map)
  var i      = props.length
  var result = clone(proto(map))
  while (i--) {
    key = props[i]
    if (predicate(map[key], key, map))  result[key] = map[key] }
  return result }


///// Function map
// Yields a new map, where the values of each key/value pair are
// transformed by the given mapper function.
//
// The map's prototype chain is maintained, but non-enumerable
// properties are discarded.
//
// map :: {k -> e}, (e, k, {k -> e} -> e) -> {k -> e}
function map(map, mapper) {
  var key
  var props  = keys(map)
  var i      = props.length
  var result = clone(proto(map))
  while (i--) {
    key = props[i]
    result[key] = mapper(map[key], key, map) }
  return result }



//// -- Exports --------------------------------------------------------
module.exports = { each      : each

                 , put       : put
                 , remove    : remove
                 , replace   : replace
                 , clear     : clear

                 , at        : at
                 , size      : size
                 , empty_p   : empty_p
                 , has_key_p : has_key_p

                 , keys      : keys
                 , values    : values
                 , items     : items

                 , reduce    : reduce
                 , every     : every
                 , some      : some
                 , filter    : filter
                 , map       : map
                 }
