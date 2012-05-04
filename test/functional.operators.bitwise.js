describe('{} functional.operators.bitwise', function() {
  var _ = require('../src/functional/operators/bitwise')
  var ensure = require('noire').ensure

  describe('λ and', function() {
    it('Given no arguments, should return 0', function() {
      ensure(_.and()).same(0)
    })
    it('Given one argument, should return that argument', function() {
      ensure(_.and(2)).same(2)
    })
    it('Given more than one argument, should recursively compute l & r', function() {
      ensure(_.and(1, 2, 3)).same(1 & 2 & 3)
    })
  })

  describe('λ or', function() {
    it('Given no arguments, should return 0', function() {
      ensure(_.or()).same(0)
    })
    it('Given one argument, should return that argument', function() {
      ensure(_.or(2)).same(2)
    })
    it('Given more than one argument, should recursively compute l | r', function() {
      ensure(_.or(1, 2, 3)).same(1 | 2 | 3)
    })
  })

  describe('λ xor', function() {
    it('Given no arguments, should return 0', function() {
      ensure(_.xor()).same(0)
    })
    it('Given one argument, should return that argument', function() {
      ensure(_.xor(2)).same(2)
    })
    it('Given more than one argument, should recursively compute l ^ r', function() {
      ensure(_.xor(1, 2, 3)).same(1 ^ 2 ^ 3)
    })
  })

  describe('λ not', function() {
    it('Given no arguments, should return -1', function() {
      ensure(_.not()).same(-1)
    })
    it('Given one argument, should bitwise negate that argument', function() {
      ensure(_.not(2)).same(~2)
      ensure(_.not(_.not(2))).same(~~2)
    })
  })

  describe('λ shl', function() {
    it('Given no arguments, should return 0', function() {
      ensure(_.shl()).same(0)
    })
    it('Given one argument, should return that argument', function() {
      ensure(_.shl(2)).same(2)
    })
    it('Given more than one arguent, should recursively compute l << r', function() {
      ensure(_.shl(3, 2, 2)).same(3 << 2 << 2)
    })
  })

  describe('λ shr', function() {
    it('Given no arguments, should return 0', function() {
      ensure(_.shr()).same(0)
    })
    it('Given one argument, should return that argument', function() {
      ensure(_.shr(2)).same(2)
    })
    it('Given more than one arguent, should recursively compute l >> r', function() {
      ensure(_.shr(1e5, 2, 2)).same(1e5 >> 2 >> 2)
    })
  })

  describe('λ ushr', function() {
    it('Given no arguments, should return 0', function() {
      ensure(_.ushr()).same(0)
    })
    it('Given one argument, should return that argument', function() {
      ensure(_.ushr(2)).same(2)
    })
    it('Given more than one arguent, should recursively compute l >>> r', function() {
      ensure(_.ushr(Math.pow(2, 20), 4, 8)).same(Math.pow(2, 20) >>> 4 >>> 8)
    })
  })
})