var fun = require('../src/fun')

function arglen()   { return arguments.length }
function get_this() { return this             }


describe('Module: fun', function() {

  describe('not :: Fun -> Fun -> Bool', function() {
    it('- Should return a new predicate, with inverted result', function() {
      fun.not(Array.isArray)({}).should.be.true
      fun.not(Array.isArray)([]).should.be.false
      fun.not(function(){ return arguments.length == 3})(1,2,3).should.be.false
      fun.not(function(){ return this === fun }.bind(fun))().should.be.false })})

  describe('partial :: Fun, Any... -> Fun', function() {
    it('- Should yield a function with the bound arguments', function() {
      fun.partial(arglen, 1, 2, 3)().should.equal(3) })

    it('- Should append arguments to the new function', function() {
      fun.partial(arglen, 1, 2, 3)(4, 5).should.equal(5) })

    it('- Should not change the `this` binding', function() {
      fun.partial(get_this, 2).call(get_this).should.equal(get_this) })
  })

  describe('delay :: Number, Fun -> Unspecified', function() {
    it('- Should execute the function after at least the given time', function(done) {
      var start = new Date
      fun.delay(1, function() {
        var delta_time = (new Date - start) / 1000
        delta_time.should.be.above(1)
        done() })})})

  describe('defer :: Fun -> Unspecified', function() {
    it('- Should asynchronously call the function as soon as possible', function(done) {
      fun.defer(function() {
        async.should.be.true
        done() })
      var async = true })})

  describe('compose :: Fun... -> Fun', function() {
    it('- Should apply the functions in order', function() {
      var arr = [1, 2, 3]
      fun.compose(take(1), take(2), take(3))()
      arr.should.be.empty

      function take(x) { return function() {
        arr[0].should.equal(x)
        arr.shift() }}})
    
    it('- Should pass the result as first argument', function() {
      fun.compose(double, squared, even_p)(2)

      function double(x) {
        (x * 2).should.equal(4)
        return x * 2 }
      function squared(x) {
        (x * x).should.equal(16)
        return x * x }
      function even_p(x) {
        (x % 2).should.equal(0) }})

    it('- Should concat other given arguments', function() {
      fun.compose(arglen)(1, 2, 3).should.equal(3)
      fun.compose(arglen, arglen)(1, 2, 3).should.equal(4) })
  })
                
})