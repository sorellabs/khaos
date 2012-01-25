/// string.js --- string utilities
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

/// Module khaos.collection.string



//// -- Building -------------------------------------------------------
function repeat(string, times) {
  return times <= 0?      ''
  :      /* otherwise */  Array(times + 1).join(string) }

function concatenate() {
  return ''.concat.apply(null, arguments) }



//// -- Manipulating ---------------------------------------------------
function trim(string) {
  return __trim.call(string) }

function trim_left(string) {
  return string.replace(/^\s+/, '') }

function trim_right(string) {
  return string.replace(/\s+$/, '') }



//// -- Inspection -----------------------------------------------------
function starts_with_p(string, what) {
  return string.slice(0, what.length) == what }

function ends_with_p(string, what) {
  return string.slice(-what.length) == what }

function size(string) {
  return string.length }

function count(string, character) {
  // TODO:
}

function empty_p(string) {
  return string === '' }

function has_p(string, what) {
  return string.indexOf(what) != -1 }

function count(string, what) {
  var pos, result
  result = 0
  while (true) {
    pos = string.indexOf(what, pos + 1)
    if (pos != -1)  ++result
    else            break }

  return result }



//// -- Case folding ---------------------------------------------------
function upcase(string) {
  return string.toUpperCase() }

function downcase(string) {
  return string.toLowerCase() }

function capitalise(string, all_words) {
  var re = all_words?       /\b\w/g
         : /* otherwise */  /\b\w/

  return downcase(string).replace(re, upcase) }

function dasherise(string) {
  return replace(trim(string), /\s+/g, '-') }

function camelise(string) {
  var re = /[\s\-_]+(\w)/g

  return downcase(str).replace(re, function(match, letter) {
    return upcase(letter) })}



//// -- Searching ------------------------------------------------------
function find(string, predicate) {
  // TODO:
}



//// -- Slicing --------------------------------------------------------
function first(string) {
  return string.charAt(0) }

function rest(string) {
  return string.slice(1) }

function last(string) {
  return string.charAt(string.length - 1) }

function but_last(string) {
  return string.slice(0, -1) }

function slice(string, start, end) {
  return string.slice(start, end) }

function take(string, size) {
  return string.slice(0, size) }

function drop(string, size) {
  return string.slice(size) }

function split(string, predicate) {
  // TODO:
}


 
//// -- Formatting -----------------------------------------------------
function format(string, mappings) {
  mappings = mappings || {}
  return string.replace(/{(\\?:)([^}]+)}/g, function(match, mod, key) {
    return starts_with_p(mod, '\\')?  '{:' + key + '}'
    :      /* otherwise */            mappings[key] })}



//// -- Comparisons ----------------------------------------------------
function compare(left, right, foldcase) {
  if (foldcase) {
    left  = downcase(left)
    right = downcase(right) }

  return left < right?   -1
  :      left === right?  0
  :      /* otherwise */  1 }

function equal_p(left, right, foldcase) {
  return !compare(left, right, foldcase) }
