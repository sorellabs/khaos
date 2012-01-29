/// type.js --- is-a type checking facilities.
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

/// Module khaos.type
//
// This module provides functions for testing internal properties of the
// objects, and might be useful for multiple dispatching in certain
// applications.
//
// These checks are provided for those times when the semantics
// associated with the given type are important to the code. For
// example, Functions and Arrays get an unique and internal tratament
// from the engine.
//
// If the internal functionality is not important, we recommend doing
// structural checks and interface matching instead, since JavaScript is
// not usually suited for *is-a* relationship tests due to its
// prototypical object orientation nature.
//
// :see also:
//   - `khaos.interface' — structural type checking module


//// -- Aliases --------------------------------------------------------
var _class = {}.toString



//// -- Generic checkers -----------------------------------------------

///// Function is_p
// Checks if an object inherits from the given prototype.
//
// is_p :: Any, Object | Fun -> Bool
function is_p(subject, prototype) {
  return fun_p(prototype)?    subject instanceof prototype
  :      /* plain Object? */  prototype.isPrototypeOf(subject) }


///// Function name
// Returns the internal `[[Class]]` property of the object.
//
// Since applying functions to `null`/`undefined` in non-strict
// mode would yield `Global` (we don't want that!), we fix it by manually
// returning the internal `[[Class]]` for such edge cases.
//
// name :: Any -> String
function name(subject) {
  return subject != null?   _class.call(subject).slice(8, -1)
  :      subject === null?  'Null'
  :      /* otherwise */    'Undefined' }



//// -- Specialised checkers -------------------------------------------

///// Function string_p
// Checks if an object is a `String`.
//
// string_p :: Any -> Bool
function string_p(subject) {
  return name(subject) == 'String' }


///// Function number_p
// Checks if an object is a `Number`.
//
// number_p :: Any -> Bool
function number_p(subject) {
  return name(subject) == 'Number' }


///// Function date_p
// Checks if an object is a `Date`.
//
// date_p :: Any -> Bool
function date_p(subject) {
  return name(subject) == 'Date' }


///// Function regexp_p
// Checks if an object is a `RegExp`.
//
// regexp_p :: Any -> Bool
function regexp_p(subject) {
  return name(subject) == 'RegExp' }


///// Function fun_p
// Checks if an object is a `Function`.
//
// fun_p :: Any -> Bool
function fun_p(subject) {
  return name(subject) == 'Function' }


///// Function bool_p
// Checks if an object is a `Boolean`.
//
// bool_p :: Any -> Bool
function bool_p(subject) {
  return name(subject) == 'Boolean' }


///// Function object_p
// Checks if an object is an `Object`.
//
// object_p :: Any -> Bool
function object_p(subject) {
  return name(subject) == 'Object' }


//// Function primitive_p
// Checks if the `subject' is a primitive.
//
// primitive_p :: Any -> Bool
function primitive_p(subject) {
  return Object(subject) !== subject }


//// Function undefined_p
// Checks if an object is `undefined`.
//
// undefined_p :: Any -> Bool
function undefined_p(subject) {
  return subject === void subject }


//// Function callable_p
// Checks if an object can be called as a function.
//
// callable_p :: Any -> Bool
function callable_p(subject) {
  return typeof subject == 'function' }



//// -- Exports --------------------------------------------------------
module.exports = { is_p        : is_p
                 , name        : name

                 , array_p     : Array.isArray
                 , string_p    : string_p
                 , number_p    : number_p
                 , date_p      : date_p
                 , regexp_p    : regexp_p
                 , fun_p       : fun_p
                 , bool_p      : bool_p
                 , object_p    : object_p
                 , primitive_p : primitive_p
                 , undefined_p : undefined_p
                 , callable_p  : callable_p
                 }
