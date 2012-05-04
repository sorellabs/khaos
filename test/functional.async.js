describe('{} functional.async', function() {
  var _      = require('../src/functional/async')
  var ensure = require('noire').ensure

  describe('λ delay', function() {
    it('Should execute `f` after the given `seconds`.', function(done) {
      var start = new Date
      _.delay(1, function() { var delta = (new Date - start) / 1000
                              ensure(delta).above(1)
                              done() })
    })})

  describe('λ defer', function() {
    it('should asynchronously call `f` as soon as possible.', function(done) {
      _.defer(function(){ ensure(async).ok()
                          done() })
      var async = true
    })})
})
