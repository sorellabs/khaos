/// arithmetic.js --- Arithmetic operators as functions
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

/// Module khaos.functional.operators.arithmetic

var fold = require('./util').fold

function sum() {
  return fold( arguments
             , function(a, b){ return a + b }
             , 0 )}

function sub() {
  return fold( arguments
             , function(a, b){ return a - b }
             , arguments.length <= 1? 0 : null )}

function mul() {
  return fold( arguments
             , function(a, b){ return a * b }
             , 1 )}

function div() {
  return fold( arguments
             , function(a, b){ return a / b }
             , arguments.length == 0? 1 : null )}

function mod() {
  return fold( arguments
             , function(a, b){ return a % b }
             , arguments.length == 0? 0 : null )}

module.exports = { sum: sum
                 , sub: sub
                 , mul: mul
                 , div: div
                 , mod: mod }
