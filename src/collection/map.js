/// map.js --- Mapping collection handling
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
var _keys        = Object.keys
  , clone        = Object.create
  , proto        = Object.getPrototypeOf
  , has_own_prop = {}.hasOwnProperty
  


//// - Traversable
///// Function each
// Applies the iterator function to each key/value pair in the map.
//
// each :: {k -> e}, (e, k, {k -> e} -> Ignored Any) -> Undefined
function each(map, iterator) { var i, len, props
  props = keys(map)
  for (i = 0, len = props.length; i < len; ++i)
    iterator(map[props[i]], props[i], map) }



//// - Manipulation
///// Function at
// Retrieves the value for the given key.
//
// at :: {k -> e}, k -> e
function at(map, key) {
  return Object(map)[key] }


///// Function put
// Assigns a value for the given key.
//
// put :: {k -> e}, k, e -> {k -> e}
function put(map, key, value) {
  Object(map)[key] = value
  return map }


///// Function remove
// Removes the given key and its associated value from the map.
//
// remove :: {k -> e}, k -> {k -> e}
function remove(map, key) {
  delete Object(map)[key]
  return map }


///// Function clear
// Removes all key/value pairs from the map.
//
// clear :: {k -> e} -> {k -> e}
function clear(map) {
  each(map, function(value, key){
              delete map[key] })
  return map }



//// - Inspection
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
  return map != null?  has_own_prop.call(map, key)
  :                    false }



//// - Decomposition
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
  return reduce(map, [], function(acc, item, key) {
                           acc.push(item)
                           return acc })}

///// Function items
// Extracts the key/value pairs from the given map.
//
// items :: {k -> e} -> [(k, e)]
function items(map) {
  return reduce(map, [], function(acc, item, key) {
                           acc.push([key, item])
                           return acc })}


//// - Folding
///// Function reduce
// Applies a function to each key/value pair in the map, returning the
// accumulated value.
//
// reduce :: {k -> e}, Any, (Any, e, k -> Any) -> Any
// reduce :: {k -> e}, (Any, e, k -> Any) -> Any
function reduce(map, value, folder) { var props, i, len
  map   = Object(map)
  props = keys(map)
  if (arguments.length == 2) {
    folder = value
    value  = map[props.shift()] }

  for (i = 0, len = props.length; i < len; ++i)
    value = folder(value, map[props[i]], props[i])

  return value }


///// Function every
// Does the predicate succeeds for each key/value pair in the map?
//
// every :: {k -> e}, (e, k, {k -> e} -> Bool) -> Bool
function every(map, predicate) { var i, props
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
function some(map, predicate) { var i, props
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
function filter(map, predicate) { var i, result, key, props
  props  = keys(map)
  i      = props.length
  result = clone(proto(map))
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
function map(map, mapper) { var i, result, key, props
  props  = keys(map)
  i      = props.length
  result = clone(proto(map))
  while (i--) {
    key = props[i]
    result[key] = mapper(map[key], key, map) }
  return result }


/// -Exports
exports.each      = each
exports.at        = at
exports.put       = put
exports.remove    = remove
exports.clear     = clear
exports.size      = size
exports.empty_p   = empty_p
exports.has_key_p = has_key_p
exports.keys      = keys
exports.values    = values
exports.items     = items
exports.reduce    = reduce
exports.every     = every
exports.some      = some
exports.filter    = filter
exports.map       = map