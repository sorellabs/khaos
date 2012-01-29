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
//
// This module provides basic services for manipulating and interacting
// with Strings in JavaScript.
//
// With this, the range of manipulation services in JavaScript is
// extended with:
//
//   * Building Strings.
//   * Trimming whitespaces from Strings.
//   * Inspecting common properties of Strings.
//   * Mapping a particular String format to another, which mostly
//     includes the special mappings for case-folding.
//   * Fine-grained and high-level slicing.
//   * Comparing strings.
//   * Formatting and templating.
//
// Some of these services are already provided by the native String
// object's prototype, in which case we just make them available through
// generic functions.


//// -- Aliases --------------------------------------------------------
var __trim        = ''.trim
var __concatenate = ''.concat



//// -- Building -------------------------------------------------------

///// Function repeat
// Creates a `String' by repeating the given one a number of `times'.
//
// repeat :: String, Number -> String
function repeat(string, times) {
  return times <= 0?      ''
  :      /* otherwise */  Array(times + 1).join(string) }


///// Function concatenate
// Creates a `String' by concatenating all the given ones together.
//
// concatenate :: String... -> String
function concatenate() {
  return __concatenate.apply('', arguments) }



//// -- Manipulating ---------------------------------------------------

///// Function trim
// Removes whitespace from both ends of the `string'.
//
// trim :: String -> String
function trim(string) {
  return __trim.call(string) }


// TODO: consider being explicit about which characters are considered
// whitespace, given the `\s' character class has several problems.

///// Function trim_left
// Removes whitespace from the beginning of the `string'.
//
// trim_left :: String -> String
function trim_left(string) {
  return string.replace(/^\s+/, '') }


///// Function trim_right
// Removes whitespace from the end of the `string'.
//
// trim_right :: String -> String
function trim_right(string) {
  return string.replace(/\s+$/, '') }



//// -- Inspection -----------------------------------------------------

///// Function starts_with_p
// Does the `string' start with a given piece of text?
//
// starts_with_p :: String, String -> Bool
function starts_with_p(string, what) {
  return string.slice(0, what.length) == what }


///// Function ends_with_p
// Does the `string' end with a given piece of text?
//
// ends_with_p :: String, String -> Bool
function ends_with_p(string, what) {
  return string.slice(-what.length) == what }


///// Function empty_p
// Is the `string' empty?
//
// empty_p :: String -> Bool
function empty_p(string) {
  return string === '' }


///// Function has_p
// Does the `string' contain a given piece of text?
//
// has_p :: String, String -> Bool
function has_p(string, what) {
  return string.indexOf(what) != -1 }


///// Function size
// Returns the number of characters in the `string'.
//
// size :: String -> Number
function size(string) {
  return string.length }


///// Function count_occurrences
// Returns the number of times the given piece of text appears in the
// `string'.
//
// count_occurrences :: String, String -> Number
function count_occurrences(string, what) {
  var pos
  var result = 0
  while (true) { pos = string.indexOf(what, pos + 1)
                 if (pos != -1)  ++result
                 else            break }

  return result }



//// -- Case folding ---------------------------------------------------

///// Function upcase
// Returns a new version of the `string', with upper-cased characters.
//
// upcase :: String -> String
function upcase(string) {
  return string.toUpperCase() }


///// Function downcase
// Returns a new version of the `string', with lower-cased characters.
//
// downcase :: String -> String
function downcase(string) {
  return string.toLowerCase() }


///// Function capitalise
// Returns a new version of the `string', with the first letter
// upper-cased, all the rest lower-cased.
//
// If `all_words' is given and is truthy, we make the first letter of
// each word upper-cased.
//
// capitalise :: String, Bool? -> String
function capitalise(string, all_words) {
  var re = all_words?       /\b\w/g
         : /* otherwise */  /\b\w/

  return downcase(string).replace(re, upcase) }


///// Function dasherise
// Returns a new version of the `string', with all words separated only
// by dashes.
//
// All of the whitespace is stripped in the process.
//
// dasherise :: String -> String
function dasherise(string) {
  return trim(string).replace(/\s+/g, '-') }


///// Function camelise
// Returns a new version of the `string', with all the whitespace and
// hyphens stripped, the first letter of each word upper-cased and the
// rest of the letters lower-cased.
//
// camelise :: String -> String
function camelise(string) {
  var re = /[\s\-_]+(\w)/g

  return downcase(string).replace(re, function(match, letter) {
                                        return upcase(letter) })}



//// -- Slicing --------------------------------------------------------

///// Function first
// Returns the first character in the `string'.
//
// first :: String -> Maybe Char
function first(string) {
  return string.charAt(0) }


///// Function rest
// Returns a new `string' with all but the first character.
//
// rest :: String -> String
function rest(string) {
  return string.slice(1) }


///// Function last
// Returns the last character in the `string'.
//
// last :: String -> Maybe Char
function last(string) {
  return string.charAt(string.length - 1) }


///// Function but_last
// Returns a new `string' with all but the last character.
//
// but_last :: String -> String
function but_last(string) {
  return string.slice(0, -1) }


///// Function slice
// Returns a new `string', containing the part of the original sequence
// from [`start', `end'[.
//
// If either `start' or `end' are given negative indexes, the number is
// taken to be an offset from the end of the sequence.
//
// slice :: String, start:Number?, end:Number? -> String
function slice(string, start, end) {
  return string.slice(start, end) }


///// Function take
// Returns a new `string', from the first character up to the given
// `size'.
//
// take :: String, Number -> String
function take(string, size) {
  return string.slice(0, size) }


///// Function drop
// Returns a new `string', without the first N items.
//
// drop :: String, Number -> String
function drop(string, size) {
  return string.slice(size) }


///// Function split
// Returns a list of `String's, by breaking the original string
// everytime the predicate holds.
//
// split :: String, (Char, Number, String -> Bool) -> [String]
function split(string, predicate) {
  var i, len
  var result = []
  var start  = 0
  for (i = 0, len = string.length; i < len; ++i) {
    if (predicate(string.charAt(i), i, string)) {
      result.push(string.slice(0, i))
      start = i }}

  if (start < len) result.push(string.slice(start))
  return result }



//// -- Comparisons ----------------------------------------------------

///// Function compare
// Returns an `Ordering' from the comparison of two `String's.
//
// If `foldcase' is given and is truthy, we ignore both string's casing
// completely, such that `Foo` would equal `foO`.
//
// compare :: String, String, Bool? -> Ordering
function compare(left, right, foldcase) {
  if (foldcase) {
    left  = downcase(left)
    right = downcase(right) }

  return left < right?   -1
  :      left === right?  0
  :      /* otherwise */  1 }


///// Function equal_p
// Are both `String's equal?
//
// If `foldcase' is given and is truthy, we ignore both string's casing
// competely, such that `Foo` would equal `foO`.
//
// equal_p :: String, String, Bool? -> Bool
function equal_p(left, right, foldcase) {
  return !compare(left, right, foldcase) }



//// -- Formatting -----------------------------------------------------

///// Function format
// Evaluates a template, substituting the variables with respect to the
// environment provided by the given `mappings'.
//
// If a mapping is not given, we assume it to be empty, in which case
// the template variables are simply stripped away.
//
// A template variable is a special construct in the form:
//
//     :bnf:
//     <template-variable> ::= "{:" <any but "}"> "}"
//
// For example, provide a "Hello, world!" template, that adjusts to a
// given name, one could write:
//
//     format("Hello, {:subject}!", { subject: "world" })
//     // => "Hello, world!"
//
// A template variable can be escaped by placing a backslash between the
// open-curly braces and the colon, such that the construct would be
// output verbatim:
//
//     // Remember backslashes must be escaped inside Strings.
//     format("Hello, {\\:subject}", { subject: "world" })
//     // => "Hello, {\\:subject}"
//
//
// format :: String, { String -> String | (String... -> String) } -> String
function format(string, mappings) {
  mappings = mappings || {}
  return string.replace(/{(\\?:)([^}]+)}/g, resolve_identifier)

  function resolve_identifier(match, mod, key) {
    return starts_with_p(mod, '\\')?  '{:' + key + '}'
    :      key in mappings?           mappings[key]
    :      /* otherwise */            '' }}




//// -- Exports --------------------------------------------------------
module.exports = { repeat            : repeat
                 , concatenate       : concatenate

                 , trim              : trim
                 , trim_left         : trim_left
                 , trim_right        : trim_right

                 , starts_with_p     : starts_with_p
                 , ends_with_p       : ends_with_p
                 , has_p             : has_p
                 , empty_p           : empty_p
                 , size              : size
                 , count_occurrences : count_occurrences

                 , upcase            : upcase
                 , downcase          : downcase
                 , capitalise        : capitalise
                 , dasherise         : dasherise
                 , camelise          : camelise

                 , first             : first
                 , rest              : rest
                 , last              : last
                 , but_last          : but_last
                 , slice             : slice
                 , take              : take
                 , drop              : drop
                 , split             : split

                 , compare           : compare
                 , equal_p           : equal_p

                 , format            : format
                 }
