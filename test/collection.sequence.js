var expect = require('expect.js')

describe('{} collection.sequence', function()  {
  var $     = require('../src/collection/sequence')
  var util  = require('./utils/core')
  var count = util.count

  describe('λ each', function() {
    it('Should apply `iterator` to every item in the sequence.', function() {
      var n = count()
      $.each('foo', n)
      expect(n()).to.be(3)

      n = count()
      $.each([1, 2, 3, 4], n)
      expect(n()).to.be(4)

      n = count()
      $.each({ 0: 1, 1: 2, length: 2 }, n)
      expect(n()).to.be(2)

      n = count()
      $.each([], n)
      expect(n()).to.be(0)

      n = count()
      $.each({ 0: 1, 1: 2 }, n)
      expect(n()).to.be(0)
    })
    it('Should work with sparse arrays.', function() {
      var n = count()
      $.each(Array(1000), n)
      expect(n()).to.be(0)

      n = count()
      var x = []; x[1] = 2; x[10] = 4
      $.each(x, n)
      expect(n()).to.be(2)

      n = count()
      $.each({ 0: 1, 4: 2, 10: 1, length: 11 }, n)
      expect(n()).to.be(3)
    })
    it('Should return Undefined', function() {
      expect($.each([1,2,3], count())).to.be(undefined)
    })
    it('Shouldn\'t mutate the sequence.', function() {
      var x = [1, 2, 3]
      $.each(x, count())
      expect(x).to.eql([1, 2, 3])
    })
  })

  describe('λ concatenate', function() {
    it('Should concatenate all sequences together.', function() {
      expect($.concatenate([1], [2], [3])).to.eql([1, 2, 3])
      expect($.concatenate([1, 2], 'foo')).to.eql([1, 2, 'f', 'o', 'o'])
      expect($.concatenate([1, 2], 'foo', {0:3,1:4,length:2})).to.eql([1, 2, 'f', 'o', 'o', 3, 4])
      expect($.concatenate('foo', [1, 2])).to.eql(['f','o','o',1,2])
    })
    it('Shouldn\'t mutate any of the sequences.', function() {
      var x = [1, 2]
      var y = [3, 4]
      var z = [5, 6]
      expect($.concatenate(x, y, z)).to.not.be(x)
      expect($.concatenate(x, y, z)).to.not.be(y)
      expect($.concatenate(x, y, z)).to.not.be(z)
      expect(x).to.eql([1, 2])
      expect(y).to.eql([3, 4])
      expect(z).to.eql([5, 6])
    })
  })

  describe('λ make', function() {
    it('Should return a new array of length `n`.', function() {
      expect($.make(3)).to.have.length(3)
      expect($.make(0)).to.have.length(0)
      expect($.make(100)).to.have.length(100)

    })
    it('Should initialise the array with given `initial`.', function() {
      expect($.make(3, 0)).to.eql([0, 0, 0])
      expect($.make(3)).to.eql([undefined, undefined, undefined])
      expect($.make(3, [1])).to.eql([[1], [1], [1]])
    })
  })

  describe('λ add', function() {
    it('- Should add items at the end of the sequence.', function() {
      var x = []
      $.add(x, 1)
      $.add(x, 2)
      $.add(x, 3)
      expect(x).to.eql([1, 2, 3])
    })
    it('- Should return the same input object.', function() {
      var x = [1, 2]
      expect($.add(x, 3)).to.be(x)
    })
  })

  describe('λ put', function() {
    it('- Should replace a value at `i` by some other value.', function() {
      var x = [1, 2, 3]
      expect($.put(x, 1, -2)).to.eql([1, -2, 3])
    })
    it('- Should return the same input object.', function() {
      var x = [1, 2, 3]
      expect($.put(x, 1, -2)).to.be(x)
    })
  })

  describe('λ remove', function() {
    it('- Should remove the item at `i`.', function() {
      var x = [1, 2, 3]
      expect($.remove(x, 1)).to.eql([1, 3])
    })
    it('- Should return the same input object.', function() {
      var x = [1, 2, 3]
      expect($.remove(x, 1)).to.be(x)
    })
  })

  describe('λ replace', function() {
    it('- Should replace all occurences of `a` by `b`.', function() {
      var x = [1, 2, 3, 2, 4, 2]
      expect($.replace(x, 2, 0)).to.eql([1, 0, 3, 0, 4, 0])
    })
    it('- Should return the same input object.', function() {
      var x = [1, 2, 3, 2, 4, 2]
      expect($.replace(x, 2, 0)).to.be(x)
    })
  })

  describe('λ insert', function() {
    it('- Should insert an item at `i`.', function() {
      var x = [1, 2, 3]
      expect($.insert(x, 1, 1.5)).to.eql([1, 1.5, 2, 3])
    })
    it('- Should return the same input object.', function() {
      var x = [1, 2, 3]
      expect($.insert(x, 1.5, 1)).to.be(x)
    })
  })

  describe('λ clear', function() {
    it('- Should empty the sequence.', function() {
      expect($.clear([1, 2, 3])).to.eql([])
    })
    it('- Should return the same input object.', function() {
      var x = [1, 2, 3]
      expect($.clear(x)).to.be(x)
    })
  })

  describe('λ at', function() {
    it('- Should return the item at `i`.', function() {
      var x = [1, 2, 3]
      expect($.at(x, 1)).to.be(2)
      expect($.at('bar', 1)).to.be('a')
      expect($.at({ 0: 1, 1: 2, length: 4 }, 1)).to.be(2)
    })
    it('- Should return `default` if there\'s no item at `i`.', function() {
      var x = [1, 2, 3]
      x[40] = 40
      expect($.at(x, 10)).to.be(undefined)
      expect($.at(x, 10, 'foo')).to.be('foo')
    })
  })

  describe('λ size', function() {
    it('- Should return the length of the sequence.', function() {
      expect($.size([1, 2, 3])).to.be(3)
      expect($.size(Array(100))).to.be(100)
      expect($.size('foo')).to.be(3)
      expect($.size({ length: 100 })).to.be(100)
    })
    it('- Should always return an UInt32.', function() {
      expect($.size({ length: -10 })).to.be(0)
      expect($.size({ length: Math.pow(2, 53) })).to.be(0)
    })
  })

  describe('λ count', function() {
    it('- Should return the number of times the predicate holds.', function() {
      expect($.count([1, 2, 3], util.always)).to.be(3)
      expect($.count(Array(100), util.always)).to.be(0)
      expect($.count([1, 2, undefined, 3], util.never)).to.be(0)
    })
    it('- Should pass [val, key, seq] to predicate.', function() {
      var x
      $.count(x = [1, 2], function(v, k, s) {
        expect([1, 2]).to.contain(v)
        expect([0, 1]).to.contain(k)
        expect(s).to.be(x) })
    })
  })

  describe('λ empty?', function() {
    it('- Should hold if sequence.length is 0.', function() {
      expect($.empty_p('')).to.be.ok()
      expect($.empty_p([])).to.be.ok()
      expect($.empty_p({ length: 0 })).to.be.ok()
      expect($.empty_p({ 0: 1, 1: 2, length: 0 })).to.be.ok()
    })
    it('- Should fail otherwise.', function() {
      expect($.empty_p('foo')).to.not.be.ok()
      expect($.empty_p([1, 2])).to.not.be.ok()
      expect($.empty_p({ length: 3 })).to.not.be.ok()
      expect($.empty_p({ 0: 1, length: 2 })).to.not.be.ok()
    })
  })

  describe('λ has?', function() {
    it('- Should hold if the sequence includes `item` at least once.')
    it('- Should fail otherwise.')
  })

  describe('λ first', function() {
    it('- Should return the first item of the sequence.')
    it('- Should return `undefined` for empty sequences.')
  })

  describe('λ rest', function() {
    it('- Should return all but the first item.')
    it('- Should always return an array.')
  })

  describe('λ last', function() {
    it('- Should return the last item of the sequence.')
    it('- Should return `undefined` for empty sequences.')
  })

  describe('λ but_last', function() {
    it('- Should return all but the last item.')
    it('- Should always return an array.')
  })

  describe('λ slice', function() {
    it('- Should return a new sequence from `start` to `end`.')
    it('- Should use the length of the array if no `end` is given.')
    it('- Should use the start of the array if no `start` is given.')
    it('- Should treat negative indexes as relative to the end of the array.')
  })

  describe('λ take', function() {
    it('- Should return the first `n` items of the sequence.')
    it('- Should take the whole array if no `n` is given.')
  })

  describe('λ drop', function() {
    it('- Should return all but the first `n` items of the sequence.')
    it('- Should return an empty list if no `n` is given.')
  })

  describe('λ split', function() {
    it('- Should return an array of arrays.')
    it('- Should split the array everytime the predicate holds.')
    it('- Shouldn\'t mutate the target sequence.')
    it('- Should pass [val, key, seq] to the predicate.')
    it('- Should return [[a]] if the predicate doesn\'t hold.')
  })

  describe('λ sort', function() {
    it('- Should return the sequence sorted.')
    it('- Should always return an array.')
    it('- Shouldn\'t mutate the sequence.')
  })

  describe('λ reversed', function() {
    it('- Should return a sequence reversed.')
    it('- Should always return an array.')
    it('- Shouldn\'t mutate the sequence.')
  })

  describe('λ find', function() {
    it('- Should return the index of first item to pass the predicate.')
    it('- Should skip non-set items.')
    it('- Should return undefined if no value is found.')
  })

  describe('λ find_last', function() {
    it('- Should return the index of the last item to pass the predicate.')
    it('- Should skip non-set items.')
    it('- Should return undefined if no value is found.')
  })

  describe('λ reduce', function() {
    it('- Should apply folder to each item in the sequence.')
    it('- Should pass [acc, val, key, seq] to folder.')
    it('- Should use initial value as first `acc`, if given.')
    it('- Should use first item as `acc`, if initial isn\'t given.')
    it('- Should use return value for next `acc`.')
    it('- Should return `acc`.')
  })

  describe('λ reduce_right', function() {
    it('- Should apply folder to each item in the sequence.')
    it('- Should apply right-to-left')
    it('- Should pass [acc, val, key, seq] to folder.')
    it('- Should use initial value as first `acc`, if given.')
    it('- Should use first item as `acc`, if initial isn\'t given.')
    it('- Should use return value for next `acc`.')
    it('- Should return `acc`.')
  })

  describe('λ every', function() {
    it('- Should apply predicate to each item in the sequence.')
    it('- Should return False as soon as the predicate fails.')
    it('- Should pass [val, key, seq] to predicate.')
    it('- Should return True if all items pass.')
  })

  describe('λ some', function() {
    it('- Should apply predicate to each item in the sequence.')
    it('- Should return True as soon as the predicate holds.')
    it('- Should pass [val, key, seq] to predicate.')
    it('- Should return False if all items fail.')
  })

  describe('λ filter', function() {
    it('- Should apply filter to each item in the sequence.')
    it('- Should return an array with items that pass the predicate.')
    it('- Shouldn\'t mutate the original sequence.')
  })

  describe('λ map', function() {
    it('- Should apply mapper for each item in the sequence.')
    it('- Should return an array with all items transformed by mapper.')
    it('- Shouldn\'t mutate the original sequence.')
  })
})