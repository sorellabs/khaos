describe('{} collection.string', function() {
  var $ = require('../src/collection/string')
  var util = require('./utils/core')
  var expect = require('expect.js')
//  var ws = "\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF"
  var ws = "\x09\x0A\x0B\x0C\x0D\x20\xA0"

  describe('λ repeat', function() {
    it('Should return an empty string for times <= 0.', function() {
      expect($.repeat('foo', 0)).to.be('')
      expect($.repeat('foo', -10)).to.be('')
    })
    it('Should repeat the given string `times` for times > 0.', function() {
      expect($.repeat('foo', 2)).to.be('foofoo')
      expect($.repeat('-.-', 5)).to.be('-.--.--.--.--.-')
    })
  })

  describe('λ concatenate', function() {
    it('Should handle gracefully non-strings.', function() {
      expect($.concatenate('f', 1)).to.be('f1')
      expect($.concatenate(0, 'f')).to.be('0f')
      expect($.concatenate(-1, 0, [1, 2])).to.be('-101,2')
      expect($.concatenate([1, 2], {})).to.be('1,2[object Object]')
      expect($.concatenate(true, undefined)).to.be('trueundefined')
      expect($.concatenate(false, null)).to.be('falsenull')
    })
    it('Should return the arguments concatenated.', function() {
      expect($.concatenate('f', 'o', 'o', 'b', 'a', 'r')).to.be('foobar')
    })
  })

  describe('λ trim', function() {
    it('Should remove whitespace from both sides.', function() {
      expect($.trim(ws + "foo" + ws)).to.be("foo")
    })
  })

  describe('λ trim_left', function() {
    it('Should remove whitespace only at the beginning.', function() {
      expect($.trim_left(ws + "foo" + ws)).to.be("foo" + ws)
    })
  })

  describe('λ trim_right', function() {
    it('Should remove whitespace only at the end.', function() {
      expect($.trim_right(ws + "foo" + ws)).to.be(ws + "foo")
    })
  })

  describe('λ starts_with_p', function() {
    it('Should return true if `what` is at the beginning of the string.', function() {
      expect($.starts_with_p("foobar", "foo")).to.be.ok()
    })
    it('Should return false otherwise.', function() {
      expect($.starts_with_p("foobar", "Foo")).to.not.be.ok()
      expect($.starts_with_p("foobar", "oo")).to.not.be.ok()
    })
  })

  describe('λ ends_with_p', function() {
    it('Should return true if `what` is at the end of the string.', function() {
      expect($.ends_with_p("foobar", "bar")).to.be.ok()
    })
    it('Should return false otherwise.', function() {
      expect($.ends_with_p("foobar", "Bar")).to.not.be.ok()
      expect($.ends_with_p("foobar", "ba")).to.not.be.ok()
    })
  })

  describe('λ empty_p', function() {
    it('Should return true if the string is empty.', function() {
      expect($.empty_p("")).to.be.ok()
    })
    it('Should return false otherwise.', function() {
      expect($.empty_p(" ")).to.not.be.ok()
      expect($.empty_p("foo")).to.not.be.ok()
    })
  })

  describe('λ has_p', function() {
    it('Should return true if `what` is contained in the string.', function() {
      expect($.has_p("foobar", "oba")).to.be.ok()
    })
    it('Should differentiate casing.', function() {
      expect($.has_p("fooBar", "oba")).to.not.be.ok()
    })
    it('Should return false otherwise.', function() {
      expect($.has_p("foobar", "fuu")).to.not.be.ok()
    })
  })

  describe('λ size', function() {
    it('Should return the length of the string.', function() {
      expect($.size("")).to.be(0)
      expect($.size(" ")).to.be(1)
      expect($.size("→⋀")).to.be(2)
    })
  })

  describe('λ count_occurrences', function() {
    it('Should return the number of occurrences of `what`.', function() {
      expect($.count_occurrences("foo", "o")).to.be(2)
      expect($.count_occurrences("foo", "O")).to.be(0)
    })
  })

  describe('λ upcase', function() {
    it('Should return the string converted to upper case.', function() {
      expect($.upcase("foo")).to.be("FOO")
      expect($.upcase("FoO")).to.be("FOO")
    })
  })

  describe('λ downcase', function() {
    it('Should return the string converted to lower case.', function() {
      expect($.downcase("FOO")).to.be("foo")
      expect($.downcase("Foo")).to.be("foo")
    })
  })

  describe('λ capitalise', function() {
    it('Should capitalise only the first word.', function() {
      expect($.capitalise("foo bar")).to.be("Foo bar")
      expect($.capitalise("001 foo bar")).to.be("001 foo bar")
    })
    it('Should downcase all non-first characters in a word.', function() {
      expect($.capitalise("FOO BAR")).to.be("Foo bar")
    })
    it('Should capitalise all words if `all_words` is truthy.', function() {
      expect($.capitalise("foo bar", true)).to.be("Foo Bar")
    })
  })

  describe('λ dasherise', function() {
    it('Should replace all whitespace separating words by dashes.', function() {
      expect($.dasherise("foo bar      baz   ")).to.be("foo-bar-baz")
      expect($.dasherise("   foo   ")).to.be("foo")
    })
  })

  describe('λ camelise', function() {
    it('Should replace all whitespace separating words by the next letter uppercased.', function() {
      expect($.camelise(" foo bar baz ")).to.be("fooBarBaz")
      expect($.camelise(" foo-bar baz ")).to.be("fooBarBaz")
    })
  })

  describe('λ first', function() {
    it('Should return the first character in the string.', function() {
      expect($.first("foobar")).to.be("f")
    })
    it('Should return Nothing for empty strings.', function() {
      expect($.first("")).to.be("")
    })
  })

  describe('λ rest', function() {
    it('Should return all but the first character in the string.', function() {
      expect($.rest("foobar")).to.be("oobar")
    })
  })

  describe('λ last', function() {
    it('Should return the last character in the string.', function() {
      expect($.last("foobar")).to.be("r")
    })
    it('Should return Nothing for empty strings.', function() {
      expect($.last("")).to.be("")
    })
  })

  describe('λ but_last', function() {
    it('Should return all but the last character in the string.', function() {
      expect($.but_last("foobar")).to.be("fooba")
    })
  })

  describe('λ slice', function() {
    it('Should return the characters between [`start`, `end`[.', function() {
      expect($.slice('bar', 1, 2)).to.be('a')
      expect($.slice('bar', 0, 2)).to.be('ba')
    })
    it('Should use the length of the string if `end` is ommited.', function() {
      expect($.slice('bar', 1)).to.be('ar')
    })
    it('Should assume the beginning of the string if `start` is ommited.', function() {
      expect($.slice('bar')).to.be('bar')
    })
    it('Should return an empty string if the slice range is <= 0', function() {
      expect($.slice('bar', 5, 0)).to.be('')
      expect($.slice('bar', 2, 2)).to.be('')
      expect($.slice('bar', 3)).to.be('')
    })
    it('Should treat negative indexes as relative to the respective end.', function() {
      expect($.slice('bar', -2)).to.be('ar')
      expect($.slice('bar', -2, -1)).to.be('a')
    })
  })

  describe('λ take', function() {
    it('Should return at most the first `n` characters.', function() {
      expect($.take('foo', 2)).to.be('fo')
      expect($.take('foo', 0)).to.be('')
    })

    it('Should return the whole string if `n` isn\'t given.', function() {
      expect($.take('foo')).to.be('foo')
    })
  })

  describe('λ drop', function() {
    it('Should skip at most the first `n` characters.', function() {
      expect($.drop('bar', 2)).to.be('r')
      expect($.drop('bar', 0)).to.be('bar')
    })

    it('Should return an empty string if `n` isn\'t given.', function() {
      expect($.drop('bar')).to.be('')
    })
  })

  describe('λ split', function() {
    function splitter(v, k, s){ return k > 0 && k % 3 == 0 }

    it('Should split the string everytime the predicate holds.', function() {
      expect($.split('foobarbaz', splitter)).to.eql(['foo','bar','baz'])
    })
    it('Should return an array with the whole string if no splits are done.', function() {
      expect($.split('foobarbaz', util.never)).to.eql(['foobarbaz'])
    })
  })

  describe('λ compare', function() {
    it('Should return -1 for L < R', function() {
      expect($.compare('bar', 'baz')).to.be(-1)
      expect($.compare('Bar', 'bar')).to.be(-1)
    })
    it('Should return  0 for L = R', function() {
      expect($.compare('baz', 'baz')).to.be(0)
    })
    it('Should return  1 for L > R', function() {
      expect($.compare('baz', 'bar')).to.be(1)
      expect($.compare('bar', 'Bar')).to.be(1)
    })
    it('Shouldn\'t take case into account if `foldcase` is true.', function() {
      expect($.compare('bar', 'Bar', true)).to.be(0)
    })
  })

  describe('λ equal_p', function() {
    it('Should return true if L = R', function() {
      expect($.equal_p('foo', 'foo')).to.be.ok()
      expect($.equal_p('foo', 'fooo')).to.not.be.ok()
      expect($.equal_p('Foo', 'foo')).to.not.be.ok()
    })
    it('Shouldn\'t take case into account if `foldcase` is true.', function() {
      expect($.equal_p('Foo', 'foo', true)).to.be.ok()
    })
  })

  describe('λ format', function() {
    it('Should replace all variables with the respective mappings.', function() {
      expect($.format('if {:a} then {:b} else {:c}', {a:true,b:false,c:true})).to.be('if true then false else true')
      expect($.format('(when {:not-nil?} #t)', {'not-nil?': false})).to.be('(when false #t)')
    })
    it('Should leave escaped variables alone.', function() {
      expect($.format('hello, {\\:world}', {world:'stuff'})).to.be('hello, {:world}')
    })
    it('Should replace by empty string if not found in mappings.', function() {
      expect($.format('{:foo}, {:bar}, {:baz}', {bar: 1})).to.be(', 1, ')
    })
  })
})

