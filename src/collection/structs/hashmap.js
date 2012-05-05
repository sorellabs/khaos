/// hashmap.js --- Simple hash-map implementation
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

/// Module khaos.collection.structs.hashmap
//
// Provides a dictionary data structure to fill up the hole left by
// JavaScript objects not being able to be used as generic
// dictionaries.
//
// The hashmap implementation uses a simple hack of prefixing keys with
// a given string to avoid problems with magical properties. The rest of
// the implementation just brings the `map' helper functions over to the
// `Hashmap' object itself.

//// -- Dependencies ---------------------------------------------------
var Base = require('boo').Base
var map  = require('../map')



//// -- Interfaces -----------------------------------------------------

///// Interface Traversable
// A traversable is any object that complies with map's `each'
// function.
//
// Traversable :: { "each" -> ({k -> e}, (e, k, {k -> e} -> Ignored) -> Undefined) }


///// Interface Hashmap
// Hashmap :: { "_dictionary" -> {k -> e}
//            , "_key_prefix" -> String
//            }


//// -- Helpers --------------------------------------------------------

///// Function traversable_p
// Does a `subject' matches the `Traversable' interface?
//
// traversable_p :: Any -> Bool
function traversable_p(subject) {
  return subject
  &&     typeof subject.each == 'function' }




//// -- Exports --------------------------------------------------------

module.exports = Base.derive({

  ///// -- Initialisation ----------------------------------------------

  ////// Function init
  // Initialises an instance of a `Hashmap'.
  //
  // If given a `Traversable' or a plain JavaScript object, the
  // key/value pairs from this object will be imported in the new
  // `Hashmap' instance.
  //
  // init! :: @this:Object* -> this
  init:
  function _init(dictionary) {
    this._key_prefix = '@'
    this._dictionary = {}
    this.update(dictionary)
    return this }


  ///// -- Traversing --------------------------------------------------

  ////// Function each
  // Applies the iterator function to each key/value pair in the map.
  //
  // each :: @this:Hashmap, (e, k, {k -> e} -> Ignored) -> Undefined
, each:
  function _each(iterator) {
    var self = this
    map.each(this._dictionary, function(value, key) {
                                 iterator( value
                                         , key.slice(this._key_prefix.length)
                                         , self) }.bind(this))
    return this }


  ///// -- Manipulation ------------------------------------------------

  ////// Function put
  // Assigns a value for the given key.
  //
  // put! :: @this:Hashmap*, k, e -> this
, put:
  function _put(key, value) {
    this._dictionary[this._key_prefix + key] = value
    return this }


  ////// Function remove
  // Removes the given key and its associated value from the `Hashmap'.
  //
  // remove! :: @this:Hashmap*, k -> this
, remove:
  function _remove(key) {
    delete this._dictionary[this._key_prefix + key]
    return this }


  ////// Function replace
  // Replaces all the occurrences of `value' by the given `replacement'.
  //
  // replace! :: @this:Hashmap*, e, e -> this
, replace:
  function _replace(value, replacement) {
    map.replace(this._dictionary, value, replacement)
    return this }


  ////// Function update
  // Updates the `Hashmap' with key/value pairs from another object
  // implementing the `Traversable' interface or just a plain JavaScript
  // object.
  //
  // Existing pairs of key/value in this `Hashmap' will be overwritten
  // by the imported dictionary ones in case of key collisions (both
  // dictionaries have the same key).
  //
  // update! :: @this:Hashmap*, (Traversable | Object) -> this
, update:
  function _update(dictionary) {
    var self = this

      traversable_p(dictionary)?  dictionary.each(import_data)
    : /* otherwise */             map.each(dictionary, import_data)

    return this

    function import_data(value, key, map) { self.put(key, value) }}


  ////// Function clear
  // Removes all key/value pairs from the `Hashmap'
  //
  // clear! :: @this:Hashmap* -> this
, clear:
  function _clear() {
    map.clear(this._dictionary)
    return this }


  ///// -- Inspection --------------------------------------------------

  ////// Function at
  // Retrieves the value for the given key.
  //
  // at :: @this:Hashmap, k, e -> e
  // at :: @this:Hashmap, k -> Maybe e
, at:
  function _at(key, _default) {
    return map.at(this._dictionary, this._key_prefix + key, _default) }


  ////// Function size
  // Returns the number of key/value pairs in the map.
  //
  // size :: @this:Hashmap -> Number
, size:
  function _size() {
    return map.size(this._dictionary) }


  ////// Function empty_p
  // Does the map have no key/value pairs?
  //
  // empty_p :: @this:Hashmap -> Bool
, empty_p:
  function _empty_p() {
    return map.empty_p(this._dictionary) }


  ////// Function has_key_p
  // Does the map have the given key?
  //
  // has_key_p :: @this:Hashmap, k -> Bool
, has_key_p:
  function _has_key_p(key) {
    return map.has_key_p(this._dictionary, this._key_prefix + key) }


  ///// -- Decomposition -----------------------------------------------

  ////// Function keys
  // Extracts the keys from the `Hashmap'.
  //
  // keys :: @this:Hashmap -> [k]
, keys:
  function _keys() {
    return map.keys(this._dictionary)
              .map(function(key) { return key.slice(this._key_prefix.length) }) }


  ////// Function values
  // Extracts the values from the `Hashmap'.
  //
  // values :: @this:Hashmap -> [e]
, values:
  function _values() {
    return map.values(this._dictionary) }


  ////// Function items
  // Extracts the key/value pairs from the `Hashmap'.
  //
  // items :: @this:Hashmap -> [(k, e)]
, items:
  function _items() {
    return this.reduce([], function(result, item, key) {
                             result.push([key, item])
                             return result })}


  ///// -- Folding -----------------------------------------------------

  ////// Function reduce
  // Applies a function to eah key/value pair in the `Hashmap',
  // returning the accumulated value.
  //
  // reduce :: @this:Hashmap, Any?, (Any, e, k, Hashmap -> Any) -> Any
, reduce:
  function _reduce(value, folder) {
    var self = this
    return map.reduce(this._dictionary, value, function(result, value, key) {
                                                 return folder( result
                                                              , value
                                                              , key.slice(this._key_prefix.length)
                                                              , self) })}

  ////// Function every
  // Dos the predicate succeeds for all key/value pairs in the
  // `Hashmap'?
  //
  // every :: @this:Hashmap, (e, k, Hashmap -> Bool) -> Bool
, every:
  function _every(predicate) {
    var self = this
    return map.every(this._dictionary, function(value, key) {
                                         return predicate( value
                                                         , key.slice(this._key_prefix.length)
                                                         , self) })}


  ////// Function some
  // Does the predicate succeeds for any key/value pair in the
  // `Hashmap'?
  //
  // some :: @this:Hashmap, (e, k, Hashmap -> Bool) -> Bool
, some:
  function _some(predicate) {
    var self = this
    return map.some(this._dictionary, function(value, key) {
                                        return predicate( value
                                                        , key.slice(this._key_prefix.length)
                                                        , self) })}


  ////// Function filter
  // Yields a new `Hashmap' keeping only the key/value pairs that pass
  // the given filter.
  //
  // filter :: @this:Hashmap, (e, k, Hashmap -> Bool) -> Hashmap
, filter:
  function _filter(predicate) {
    var self = this
    this._dictionary = map.filter(this._dictionary, function(value, key) {
                                                      return predicate( value
                                                                      , key.slice(this._key_prefix.length)
                                                                      , self) })
    return this }


  ////// Function map
  // Yields a new `Hashmap', where the values of each key/value pair are
  // transformed by the given mapping function.
  //
  // map :: @this:Hashmap, (e, k, Hashmap -> e) -> Hashmap
, map:
  function _map(mapper) {
    var self = this
    this._dictionary = map.map(this._dictionary, function(value, key) {
                                                   return mapper( value
                                                                , key.slice(this._key_prefix.length)
                                                                , self) })
    return this }
})