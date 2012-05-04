describe('{} functional.core', function() {
  var _ = require('../src/functional/core')
  var ensure = require('noire').ensure

  describe('λ id', function() {
    it('Should always return its argument.', function() {
      ensure(_.id(1)).same(1)
      ensure(_.id(_)).same(_)
    })
  })

  describe('λ k', function() {
    it('Should always return its bound argument.', function() {
      ensure(_.k(1)(2)).same(1)
      ensure(_.k(_)({})).same(_)
    })
  })

  describe('λ noop', function() {
    it('Should never return anything.', function() {
      ensure(_.noop(true)).same(undefined)
      ensure(_.noop()).same(undefined)
    })
  })
})