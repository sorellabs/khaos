describe('{} functional.operators.arithmetic', function() {
  var _ = require('../src/functional/operators/arithmetic')
  var ensure = require('noire').ensure

  describe('λ sum', function() {
    it('Given no arguments, should return 0', function() {
      ensure(_.sum()).same(0)
    })
    it('Given one number, should return that number', function() {
      ensure(_.sum(1)).same(1)
    })
    it('Given more than one number, should return the sum of all the numbers', function() {
      ensure(_.sum(2, 4)).same(2 + 4)
      ensure(_.sum(1, 2, 4, 5, 6, 7, 8, 9)).same(1 + 2 + 4 + 5 + 6 + 7 + 8 + 9)
    })
    it('Given non-numeric arguments, should cast them to numbers', function() {
      ensure(_.sum(1, '2', '3')).same(6)
    })
  })

  describe('λ sub', function() {
    it('Given no arguments, should return 0', function() {
      ensure(_.sub()).same(0)
    })
    it('Given one number, should return that number * -1', function() {
      ensure(_.sub(1)).same(-1)
    })
    it('Given more than one number, should return the subtraction of all the numbers left-to-right', function() {
      ensure(_.sub(1, 2)).same(1 - 2)
      ensure(_.sub(10, 4, 2, 1)).same(((10 - 4) - 2) - 1)
    })
  })

  describe('λ mul', function() {
    it('Given no arguments, should return 1', function() {
      ensure(_.mul()).same(1)
    })
    it('Given one number, should return that number', function() {
      ensure(_.mul(2)).same(2)
    })
    it('Given more than one number, should return the product of all the numbers', function() {
      ensure(_.mul(2, 3)).same(2 * 3)
      ensure(_.mul(1, 2, 3, 4, 5)).same(1 * 2 * 3 * 4 * 5)
    })
  })

  describe('λ div', function() {
    it('Given no arguments, should return 1', function() {
      ensure(_.div()).same(1)
    })
    it('Given one number, should return that number', function() {
      ensure(_.div(2)).same(2)
    })
    it('Given more than one number, should return the division of all the numbers left-to-right', function() {
      ensure(_.div(4, 2)).same(4 / 2)
      ensure(_.div(32, 4, 2)).same((32 / 4) / 2)
    })
  })

  describe('λ mod', function() {
    it('Given no arguments, should return 0', function() {
      ensure(_.mod()).same(0)
    })
    it('Given one number, should return that number', function() {
      ensure(_.mod(2)).same(2)
    })
    it('Given more than one number, should return the modulus of all the number left-to-right', function() {
      ensure(_.mod(5, 3)).same(5 % 3)
      ensure(_.mod(42, 23, 12)).same((42 % 23) % 12)
    })
  })
})