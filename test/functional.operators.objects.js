describe('{} functional.operators.objects', function() {

  var _ = require('../src/functional/operators/objects')
  var ensure = require('noire').ensure

  var x = { a: 1, b: 2 }
  var y = Object.create(x); y.c = 3;
  var z = Object.create(y); z.d = function(a, b){ return this.a + this.b + this.c + a + b }

  describe('λ property', function() {
    it('Should return the value of the given property.', function() {
      ensure(_.property('a', x)).same(x.a)
      ensure(_.property('b', y)).same(y.b)
      ensure(_.property('d', z)).same(z.d)
      ensure(_.property('c', x)).same(undefined)
    })
  })

  describe('λ has_p', function() {
    it('Should return whether the property can be found in the object (or protos).', function() {
      ensure(_.has_p('a', z)).ok()
      ensure(_.has_p('b', x)).ok()
      ensure(_.has_p('c', x)).not().ok()
    })
  })

  describe('λ method', function() {
    it('Should invoke a method with given arguments and return the value.', function() {
      ensure(_.method('d', 1, 2, z)).same(z.d(1, 2))
    })
    it('Should apply the right `this`.', function() {
      ensure(_.method('d', 0, 0, z)).same(z.a + z.b + z.c)
    })
  })
})