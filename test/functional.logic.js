describe('{} functional.logic', function() {
  var _ = require('../src/functional/logic')
  var ensure = require('noire').ensure

  function a(){ return a }
  function b(){ return b }
  function c(){ return 1 }
  function d(){ }
  function e(){ return false }

  describe('λ or', function() {
    it('Should return the value of the first truthy function', function() {
      ensure(_.or(a, b, c)()).same(a())
      ensure(_.or(b, c, a)()).same(b())
      ensure(_.or(c, b, a)()).same(c())
      ensure(_.or(d, a, b)()).same(a())
      ensure(_.or(d, e, a)()).same(a())
    })
    it('Should return `undefined` if no functions are yield truthy values.', function() {
      ensure(_.or()()).same(undefined)
      ensure(_.or(d)()).same(undefined)
    })
  })
  describe('λ and', function() {
    it('Should return `undefined` if any of the functions yield non-truthy values.', function() {
      ensure(_.and(d, b, c)()).same(undefined)
      ensure(_.and(b, d, a)()).same(undefined)
      ensure(_.and(c, b, d)()).same(undefined)
    })
    it('Should return the result of the last function, granted all yield truthy.', function() {
      ensure(_.and(a, b, c)()).same(c())
      ensure(_.and(a, c, b)()).same(b())
      ensure(_.and(c, b, a)()).same(a())
    })
  })
  describe('λ not', function() {
    it('Should negate the value of the function it\'s given.', function() {
      ensure(_.not(a)()).same(false)
      ensure(_.not(b)()).same(false)
      ensure(_.not(e)()).same(true)
      ensure(_.not(d)()).same(true)
    })
  })
})