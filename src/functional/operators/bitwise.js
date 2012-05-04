/// bitwise.js --- Bitwise operators as functions
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

/// Module khaos.functional.operators.bitwise

var fold = require('./util').fold

function and() {
  return fold( arguments
             , function(a, b){ return a & b }
             , arguments.length == 0? 0 : null )}

function or() {
  return fold( arguments
             , function(a, b){ return a | b }
             , 0 )}

function xor() {
  return fold( arguments
             , function(a, b){ return a ^ b }
             , 0 )}

function not(x) { return ~x }

function shl() {
  return fold( arguments
             , function(a, b){ return a << b }
             , arguments.length == 0? 0 : null )}

function shr() {
  return fold( arguments
             , function(a, b){ return a >> b }
             , arguments.length == 0? 0 : null )}

function ushr() {
  return fold( arguments
             , function(a, b){ return a >>> b }
             , arguments.length == 0? 0 : null )}


module.exports = { and  : and
                 , or   : or
                 , xor  : xor
                 , not  : not
                 , shl  : shl
                 , shr  : shr
                 , ushr : ushr }