var obj = require('../src/obj')

describe('Module: obj', function() {

  describe('extend', function() {
    it('- Should modify the first argument', function() {
      var x = {}
      obj.extend(x, {a: 1})
      x.a.should.equal(1) })

    it('- Should use right-most precedence', function() {
      var x = {a:1}
      obj.extend(x, {b:1}, {a:2}, {c:3, b:3})
      x.a.should.equal(2)
      x.b.should.equal(3)
      x.c.should.equal(3) })

    it('- Should clone mixins using the #to_data method', function() {
      var x = {}
      var y = {data:[], to_data:function(){ return { data:[] }}}
      obj.extend(x, y)
      x.data.push(1)
      y.data.should.be.empty
      x.data.length.should.equal(1)
      x.data[0].should.equal(1) })
  })

  describe('clone', function() {
    it('- Should make a new object inheriting from proto', function() {
      var foo = {a:1}
      var bar = obj.clone(foo, {a:2})
      bar.a.should.equal(2)
      foo.isPrototypeOf(bar).should.be.true })

    it('- Should extend the new object with the given mixins', function() {
      var foo = {a:1}
      var bar = obj.clone(foo, {b:2, c:3, a:4})
      foo.should.not.have.property('b')
      foo.should.not.have.property('c')
      foo.a.should.equal(1)
      bar.a.should.equal(4)
      bar.b.should.equal(2)
      bar.c.should.equal(3) })      
  })

  describe('Object: base', function() {
    describe('make', function() {
      it('- Should clone `this`', function() {
        var x = obj.base.make()
        obj.base.isPrototypeOf(x).should.be.true })

      it('- Should apply the `init` method, if present', function(){
        var y = obj.base.clone({init:function(n){ this.a = n }})
        var z = y.make(3)
        z.a.should.equal(3) })
    })

    describe('clone', function() {
      it('- Should clone `this`', function(){
        var bar = obj.base.clone({a:2})
        obj.base.isPrototypeOf(bar).should.be.true })
      
      it('- Should extend the new object with the gven mixins', function() {
        var bar = obj.base.clone({a:2}, {b:3}, {c:4})
        bar.should.include.object({a:2,b:3,c:4}) })
    })
  })
})