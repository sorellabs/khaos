var map = require('../src/collection/map')
var should = require('should')

function d(value, enumerable) {
  return { value: value
         , enumerable: enumerable === false? false : true
         , configurable: true
         , writable: true }
}

function count() {
  return function _() {
    return _.num = (_.num || 0) + 1 }}

describe('Package: collection', function() {
  describe('Module: map', function() {
    var foo = {a:1}
    var data

    beforeEach(function() {
      data = Object.create(foo, {
        b: d(2),
        c: d(3, false),
        d: d(4) })})

    describe('each', function() {
      it('- Should apply iterator to every own enumerable property', function() {
        var c = count()
        map.each(data, c)
        c.num.should.equal(2) })

      it('- Should pass (value, key, map) to the iterator', function() {
        map.each(data, function(v,k,m) {
          m.should.equal(data)
          ;['b', 'd'].should.contain(k)
          ;[2, 4].should.contain(v) })})
    })

    describe('at', function() {
      it('- Should retrieve the value for the given key', function() {
        should.not.exist(map.at(null, 'foo'))
        map.at(data, 'a').should.equal(1)
        map.at(data, 'b').should.equal(2)
        map.at(data, 'c').should.equal(3) })
    })

    describe('put', function() {
      it('- Should assign a value to the given key', function() {
        should.not.exist(map.put(null, 'a', 1))
        map.put(data, 'b', 3)
        map.put(data, 'e', 4)
        data.b.should.equal(3)
        data.e.should.equal(4) })
    })

    describe('remove', function() {
      it('- Should delete the given key from the map', function() {
        should.not.exist(map.remove(null, 'a'))
        map.remove(data, 'b')
        map.should.not.have.ownProperty('b') })
    })

    describe('clear', function() {
      it('- Should remove all enumerable keys from the map', function(){
        should.not.exist(map.clear(null))
        map.clear(data)
        data.a.should.equal(1)
        data.should.not.have.ownProperty('b')
        data.should.haveOwnProperty('c')
        data.should.not.have.ownProperty('d') })
    })

    describe('size', function() {
      it('- Should return the number of enumerable keys in the map', function() {
        map.size(null).should.equal(0)
        map.size(data).should.equal(2) })
    })

    describe('empty_p', function() {
      it('- Should check if there\'s any enumerable key in the map', function() {
        map.empty_p(null).should.be.true
        map.empty_p({}).should.be.true
        map.empty_p(data).should.be.false
        delete data.b
        delete data.d
        map.empty_p(data).should.be.true })
    })

    describe('has_key_p', function() {
      it('- Should check if the map has the key', function() {
        map.has_key_p(null, 'a').should.be.false
        map.has_key_p(data, 'b').should.be.true
        map.has_key_p(data, 'a').should.be.false
        map.has_key_p(data, 'c').should.be.true })
    })

    describe('keys', function() {
      it('- Should return all enumerable keys in the map', function() {
        map.keys(null).length.should.equal(0)
        map.keys(data).should.eql(['b','d']) })
    })

    describe('values', function() {
      it('- Should return all enumerable values in the map', function() {
        map.values(null).length.should.equal(0)
        map.values(data).should.eql([2, 4]) })
    })

    describe('items', function() {
      it('- Should return all enumerable key/value pairs in the map', function() {
        map.items(null).length.should.equal(0)
        map.items(data).should.eql([['b',2],['d',4]]) })
    })

    describe('reduce', function() {
      it('- Should apply the function to all key/value pairs in the map')
      it('- Should return the accumulated value')
      it('- Should use the first key/value pair as initial value if one isnt given')
    })

    describe('every', function() {
      it('- Should check if all key/value pairs pass the predicate')
      it('- Should short-circuit')
    })

    describe('some', function() {
      it('- Should check if any key/value pairs pass the predicate')
      it('- Should short-circuit')
    })

    describe('filter', function() {
      it('- Should keep only key/value pairs that pass the predicate')
      it('- Should return a new map')
      it('- Should keep only own/enumerable properties')
    })

    describe('map', function() {
      it('- Should transform all enumerable key/value pairs')
      it('- Should return a new map')
      it('- Should keep only own/enumerable properties')
    })
  })
})

