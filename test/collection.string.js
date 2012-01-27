var str = require('../src/collection/string')
var should = require('should')

describe('Package: collection', function() {
  describe('Module: string', function() {
    describe('repeat', function() {
      it('- Should return an empty string for times=0.')
      it('- Should repeat the given string `times` for times>0.')
    })

    describe('concatenate', function() {
      it('- Should handle gracefully non-strings.')
      it('- Should return the arguments concatenated.')
    })

    describe('trim', function() {
      it('- Should remove whitespace from both sides.')
      it('- Should stick to the definitions of whitespace on ES grammar.')
    })

    describe('trim_left', function() {
      it('- Should remove whitespace only at the beginning.')
      it('- Should stick to the definitions of whitespace on ES grammar.')
    })

    describe('trim_right', function() {
      it('- Should remove whitespace only at the end.')
      it('- Should stick to the definition of whitespace on ES grammar.')
    })

    describe('starts_with_p', function() {
      it('- Should return true if `what` is at the beginning of the string.')
      it('- Should return false otherwise.')
    })

    describe('ends_with_p', function() {
      it('- Should return true if `what` is at the end of the string.')
      it('- Should return false otherwise.')
    })

    describe('empty_p', function() {
      it('- Should return true if the string is empty.')
      it('- Should return false otherwise.')
    })

    describe('has_p', function() {
      it('- Should return true if `what` is contained in the string.')
      it('- Should differentiate casing.')
      it('- Should return false otherwise.')
    })

    describe('size', function() {
      it('- Should return the length of the string.')
    })

    describe('count', function() {
      it('- Should return the number of occurrences of `what`.')
      it('- Should return Nothing if none is found.')
    })

    describe('upcase', function() {
      it('- Should return the string converted to upper case.')
    })

    describe('downcase', function() {
      it('- Should return the string converted to lower case.')
    })

    describe('capitalise', function() {
      it('- Should capitalise only the first word.')
      it('- Should consider a word something that starts after a non-word boundary.')
      it('- Should downcase all non-first characters in a word.')
      it('- Should capitalise all words if `all_words` is truthy.')
    })

    describe('dasherise', function() {
      it('- Should replace all whitespace separating words by dashes.')
      it('- Should remove all whitespace.')
    })

    describe('camelise', function() {
      it('- Should replace all whitespace separating words by the next letter uppercased.')
      it('- Should remove all whitespace.')
      it('- Should downcase all non-first characters in a word.')
    })

    describe('find', function() {
      it('- Should apply the predicate to every letter in the string, ltr.')
      it('- Should short-circuit when the predicate holds.')
      it('- Should return the 0-based index of the first match found.')
      it('- Should return Nothing if not found.')
    })

    describe('find_last', function() {
      it('- Should apply the predicate to every letter in the string, rtl.')
      it('- Should short-circuit when the predicate holds.')
      it('- Should return the 0-based index of the last match found.')
      it('- Should return Nothing if not found.')
    })

    describe('first', function() {
      it('- Should return the first character in the string.')
      it('- Should return Nothing for empty strings.')
    })

    describe('rest', function() {
      it('- Should return all but the first character in the string.')
    })

    describe('last', function() {
      it('- Should return the last character in the string.')
      it('- Should return Nothing for empty strings.')
    })

    describe('but_last', function() {
      it('- Should return all but the last character in the string.')
    })

    describe('slice', function() {
      it('- Should return the characters between [`start`, `end`[.')
      it('- Should use the length of the string if `end` is ommited.')
      it('- Should assume the beginning of the string if `start` is ommited.')
      it('- Should return an empty string if the slice range is <= 0')
      it('- Should treat negative indexes as relative to the respective end.')
    })

    describe('take', function() {
      it('- Should return at most the first `n` characters.')
    })

    describe('drop', function() {
      it('- Should skip at most the first `n` characters.')
    })

    describe('split', function() {
      it('- Should split the string everytime the predicate holds.')
      it('- Should return an array of the split strings.')
      it('- Should return an array with the whole string if no splits are done.')
    })

    describe('format', function() {
      it('- Should replace all variables with the respective mappings.')
      it('- Should leave escaped variables alone.')
      it('- Should replace by empty string if not found in mappings.')
    })

    describe('compare', function() {
      it('- Should return -1 for L < R')
      it('- Should return  0 for L = R')
      it('- Should return  1 for L > R')
      it('- Shouldn\'t take case into account if `foldcase` is true.')
    })

    describe('equal_p', function() {
      it('- Should return true if L = R')
      it('- Shouldn\'t take case into account if `foldcase` is true.')
    })
  })
})

