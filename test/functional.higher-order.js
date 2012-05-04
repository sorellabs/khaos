describe('{} functional.higher-order', function() {
  var _ = require('../src/functional/higher-order')
  var ensure = require('noire').ensure

  var f, g, h, z, a, b, invoke
  beforeEach(function() {
    invoke = []

    a = function(){ invoke.push('a'); return invoke }
    b = function(){ invoke.push('b'); return invoke }

    f = function(a){ return a / 2 }
    g = function(b, c){ return b + c }
    h = function(){ return arguments[0] + arguments[1] + arguments[2] }
    z = function(a, b){ return a + b + this.c }
  })

  describe('λ compose', function() {
    it('Should return a new function', function() {
      ensure(_.compose(f, g)).type('function')
      ensure(_.compose(f, g)).not().same(f)
      ensure(_.compose(f, g)).not().same(g) })

    it('Should apply functions from right to left', function() {
      ensure(_.compose(a, b)()).equals(['b', 'a']) })

    it('Should pipe the result as the only argument', function() {
      ensure(_.compose(f, g)(2, 4)).same(3)
      ensure(_.compose(f, f, g)(4, 4)).same(2) })
  })


  describe('λ curry', function() {
    it('Should return a new function', function() {
      ensure(_.curry(g)).type('function')
      ensure(_.curry(g)).not().same(g) })

    it('Should take arguments until the number of arguments matches the arity', function() {
      var cg = _.curry(g)
      ensure(cg(2)).type('function')
      ensure(cg(2)(4)).same(g(2, 4))
      ensure(_.curry(3, h)(1, 2)(4)).same(h(1,2,4)) })

    it('Should accept an initial list of arguments when currying', function() {
      var cg = _.curry(g, [2])
      ensure(cg(4)).same(g(2, 4)) })
  })

  describe('λ uncurry', function() {
    it('Should return a new function', function() {
      ensure(_.uncurry(g)).type('function')
      ensure(_.uncurry(g)).not().same(g) })

    it('Should accept arguments as a single list, and apply them to the function', function() {
      ensure(_.uncurry(g)([2, 4])).same(g(2, 4))
      ensure(_.uncurry(h)([2, 4, 6])).same(h(2, 4, 6)) })
  })

  describe('λ uncurry_bind', function() {
    it('Should return a new function', function() {
      ensure(_.uncurry_bind(g)).type('function')
      ensure(_.uncurry_bind(g)).not().same(g) })

    it('Should accept arguments as a single list, and apply them using `car` as `this`', function() {
      ensure(_.uncurry_bind(g)([null, 2, 4])).same(g(2, 4))
      ensure(_.uncurry_bind(z)([{c:1}, 2, 4])).same(z.call({c:1}, 2, 4)) })
  })

  describe('λ partial', function() {
    it('Should return a new function', function() {
      ensure(_.partial(g)).type('function')
      ensure(_.partial(g)).not().same(g) })

    it('Should apply the initial arguments concatenated with given ones to the function', function() {
      ensure(_.partial(g, 2)(2)).same(g(2, 2))
      ensure(_.partial(h, 2, 3)(4)).same(h(2, 3, 4)) })

    it('Should accept a pattern describing which parameters to specity')
  })

  describe('λ wrap', function() {
    it('Should return a new function', function() {
      ensure(_.wrap(g)).type('function')
      ensure(_.wrap(g)).not().same(g) })

    it('Should pass the wrapped function to the wrapper with given arguments', function() {
      _.wrap(g, function(a){ ensure(a).same(g) })() })

    it('Should return the result of the wrapper application', function() {
      ensure(_.wrap(g, function(a, b, c){ return a(b, c) })(1, 2)).same(g(1, 2)) })
  })
})