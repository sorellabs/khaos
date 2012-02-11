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

var Base = require('boo').Base
var map  = require('../map')


function traversable_p(subject) {
  return subject
  &&     typeof subject.each == 'function' }


module.exports = Base.derive({
  init:
  function _init(dictionary) {
    this._key_prefix = '@'
    this._dictionary = {}
    this.update(dictionary)
    return this }

, each:
  function _each(iterator) {
    var self = this
    map.each(this._dictionary, function(value, key) {
                                 iterator( value
                                         , key.slice(this._key_prefix.length)
                                         , self) })
    return this }

, put:
  function _put(key, value) {
    this._dictionary[this._key_prefix + key] = value
    return this }

, remove:
  function _remove(key) {
    delete this._dictionary[this._key_prefix + key]
    return this }

, replace:
  function _replace(value, replacement) {
    map.replace(this._dictionary, value, replacement)
    return this }

, update:
  function _update(dictionary) {
    var self    = this
    var fix_key = key_mapping(Object(dictionary))

      traversable_p(dictionary)?  dictionary.each(import_data)
    : /* otherwise */             map.each(dictionary, import_data)

    function import_data(value, key, map) { self.put(fix_key(key), value) }
    function key_mapping(map) {
      return '_key_prefix' in map? function(key){ return key.slice(map._key_prefix.length) }
      :      /* otherwise */       function(key){ return key                               }}

    return this }

, clear:
  function _clear() {
    map.clear(this._dictionary)
    return this }

, at:
  function _at(key, _default) {
    return map.at(this._dictionary, this._key_prefix + key, _default) }

, size:
  function _size() {
    return map.size(this._dictionary) }

, empty_p:
  function _empty_p() {
    return map.empty_p(this._dictionary) }

, has_key_p:
  function _has_key_p(key) {
    return map.has_key_p(this._dictionary, this._key_prefix + key) }

, keys:
  function _keys() {
    return map.keys(this._dictionary)
              .map(function(key) { return key.slice(this._key_prefix.length) }) }

, values:
  function _values() {
    return map.values(this._dictionary) }

, items:
  function _items() {
    return this.reduce([], function(result, item, key) {
                             result.push([key, item])
                             return result })}

, reduce:
  function _reduce(value, folder) {
    var self = this
    return map.reduce(this._dictionary, value, function(result, value, key) {
                                                 return folder( result
                                                              , value
                                                              , key.slice(this._key_prefix.length)
                                                              , self) })}

, every:
  function _every(predicate) {
    var self = this
    return map.every(this._dictionary, function(value, key) {
                                         return predicate( value
                                                         , key.slice(this._key_prefix.length)
                                                         , self) })}

, some:
  function _some(predicate) {
    var self = this
    return map.some(this._dictionary, function(value, key) {
                                        return predicate( value
                                                        , key.slice(this._key_prefix.length)
                                                        , self) })}

, filter:
  function _filter(predicate) {
    var self = this
    this._dictionary = map.filter(this._dictionary, function(value, key) {
                                                      return predicate( value
                                                                      , key.slice(this._key_prefix.length)
                                                                      , self) })
    return this }

, map:
  function _map(mapper) {
    var self = this
    this._dictionary = map.map(this._dictionary, function(value, key) {
                                                   return mapper( value
                                                                , key.slice(this._key_prefix.length)
                                                                , self) })
    return this }
})