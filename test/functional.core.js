describe('{} functional.core', function() {
  var fun = require('../src/functional/core')
  var expect = require('expect.js')

  function arglen()   { return arguments.length }
  function get_this() { return this             }


  describe('λ not', function() {
    it('Should return a new predicate, with inverted result', function() {
      expect(fun.not(Array.isArray)({})).to.be.ok()
      expect(fun.not(Array.isArray)([])).to.not.be.ok()
      expect(fun.not(function(){ return arguments.length == 3})(1,2,3)).to.not.be.ok()
      expect(fun.not(function(){ return this === fun }.bind(fun))()).to.not.be.ok() })})

  describe('λ partial', function() {
    it('Should yield a function with the bound arguments', function() {
      expect(fun.partial(arglen, 1, 2, 3)()).to.be(3) })

    it('Should append arguments to the new function', function() {
      expect(fun.partial(arglen, 1, 2, 3)(4, 5)).to.be(5) })

    it('Should not change the `this` binding', function() {
      expect(fun.partial(get_this, 2).call(get_this)).to.be(get_this) })
  })

  describe('λ delay', function() {
    it('Should execute the function after at least the given time', function(done) {
      var start = new Date
      fun.delay(1, function() {
        var delta_time = (new Date - start) / 1000
        expect(delta_time).to.be.above(1)
        done() })})})

  describe('λ defer', function() {
    it('Should asynchronously call the function as soon as possible', function(done) {
      fun.defer(function() {
        expect(async).to.be.ok()
        done() })
      var async = true })})

  describe('λ compose', function() {
    it('Should apply the functions in order', function() {
      var arr = [1, 2, 3]
      fun.compose(take(1), take(2), take(3))()
      expect(arr).to.eql([])

      function take(x) { return function() {
        expect(arr[0]).to.be(x)
        arr.shift() }}})

    it('Should pass the result as first argument', function() {
      fun.compose(double, squared, even_p)(2)

      function double(x) {
        expect((x * 2)).to.be(4)
        return x * 2 }
      function squared(x) {
        expect((x * x)).to.be(16)
        return x * x }
      function even_p(x) {
        expect((x % 2)).to.be(0) }})
  })

})