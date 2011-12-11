/// obj.js --- Prototypical utilities
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

/// Module khaos.obj
var slice   = [].slice
  , keys    = Object.keys
  , inherit = Object.create

function callable_p(subject) {
  return typeof subject == 'function' }


function data_obj_p(subject) {
  return subject != null
  &&     typeof subject.to_data == 'function' }


function resolve_mixin(object) {
  return data_obj_p(object)?  object.to_data()
  :                           object }


function fast_extend(object, mixins) { var i, j, len, mixin, props, key
  for (i = 0, len = mixins.length; i < len; ++i) {
    mixin = resolve_mixin(mixins[i])
    props = keys(mixin)
    for (j = props.length; j--;) {
      key         = props[j]
      object[key] = mixin[key] }}

  return object }


function extend(target) { var args
  args = [target]
  args.push(slice.call(arguments, 1))
  return fast_extend.apply(null, args) }


function clone(proto) {
  return fast_extend(inherit(proto), slice.call(arguments, 1)) }
  

var base = {
  make:
  function make() { var result
    result = inherit(this)
    if (callable_p(result.init))
      result.init.apply(result, slice.call(arguments))

    return result }

, clone:
  function clone() {
    return fast_extend(inherit(this), arguments) }}


exports.extend = extend
exports.clone  = clone
exports.base   = base

exports.internal = { data_obj_p:    data_obj_p
                   , callable_p:    callable_p
                   , fast_extend:   fast_extend
                   , resolve_mixin: resolve_mixin }