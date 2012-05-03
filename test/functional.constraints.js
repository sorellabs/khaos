describe('{} functional.constraints', function() {
  var _ = require('../src/functional/constraints')
  var ensure = require('noire').ensure
  var sinon = require('sinon')


  describe('λ limit', function() {
    it('Should return a function that will be called at most X times.', function() {
      var g = sinon.stub()
      var x = _.limit(0, g)()
      ensure(g).property('callCount', 0)

      g = sinon.stub()
      x = _.limit(3, g)
      x(); x()
      ensure(g).property('callCount', 2)

      g = sinon.stub()
      x = _.limit(5, g)
      x(); x(); x(); x(); x(); x()
      ensure(g).property('callCount', 5)
    })
  })

  describe('λ until', function() {
    it('Should call the wrapped function until the predicate holds.', function() {
      var x = 2
      var g = function(){ return true }
      var f = _.until(function(){ return x-- <= 0 }, g)

      ensure(f()).same(true)
      ensure(f()).same(true)
      ensure(f()).same(undefined)
      ensure(f()).same(undefined)
    })
  })

  describe('λ when', function() {
    it('Should NOT call the wrapped function until the predicate holds.', function() {
      var x = 2
      var g = function(){ return true }
      var f = _.when(function(){ return x-- <= 0 }, g)

      ensure(f()).same(undefined)
      ensure(f()).same(undefined)
      ensure(f()).same(true)
      ensure(f()).same(true)
    })

  })
})