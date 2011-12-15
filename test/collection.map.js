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
    var data, keys, values

    function check_call(value, key) {
      var i = keys.indexOf(key)
      i.should.not.equal(-1)
      values[i].should.equal(value)
      keys.splice(i, 1)
      values.splice(i, 1)
      return [key, value] }
      

    beforeEach(function() {
      keys   = ['b', 'd']
      values = [2, 4]
      data   = Object.create(foo, {
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
          keys.should.contain(k)
          values.should.contain(v) })})
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
        map.keys(data).should.eql(keys) })
    })

    describe('values', function() {
      it('- Should return all enumerable values in the map', function() {
        map.values(null).length.should.equal(0)
        map.values(data).should.eql(values) })
    })

    describe('items', function() {
      it('- Should return all enumerable key/value pairs in the map', function() {
        map.items(null).length.should.equal(0)
        map.items(data).should.eql([['b',2],['d',4]]) })
    })

    describe('reduce', function() {
      it('- Should apply the function to all key/value pairs in the map', function() {
        map.reduce(data, 0, function(acc, value, key) {
          check_call(value, key) })

        keys.should.be.empty
        values.should.be.empty })

      it('- Should return the accumulated value', function() {
        map.reduce(data, 0, function(acc, value) {
          return acc + value }).should.equal(6) })

      it('- Should use the first key/value pair as initial value if one isnt given', function() {
        map.reduce(data, function(acc, value) {
          values.should.contain(acc) })})
    })

    describe('every', function() {
      it('- Should check if all key/value pairs pass the predicate', function() {
        map.every(data, check_call).should.be.true
        keys.should.be.empty
        values.should.be.empty })
      
      it('- Should short-circuit', function() {
        var x = true
        var c = 0
        map.every(data, function(acc, value) {
          c++
          return x = !x }).should.be.false
        c.should.equal(1) })
    })

    describe('some', function() {
      it('- Should check if any key/value pairs pass the predicate', function() {
        map.some(data, function(v,k){ check_call(v, k) }).should.be.false
        keys.should.be.empty
        values.should.be.empty })

      it('- Should short-circuit', function() {
        map.some(data, check_call).should.be.true
        keys.length.should.equal(1) })
    })

    describe('filter', function() {
      it('- Should keep only key/value pairs that pass the predicate', function() {
        var m = map.filter(data, function(v, k) { return k == 'b' })
        m.should.eql({'b': 2}) })

      it('- Should return a new map', function() {
        map.filter(data, check_call).should.not.equal(data) })

      it('- Should keep only own/enumerable properties', function() {
        var m = map.filter(data, function(v, k) { return k == 'c' })
        m.should.eql({}) })
    })

    describe('map', function() {
      it('- Should transform all enumerable key/value pairs', function() {
        var m = map.map(data, function(v, k) { return v * 2 })
        m.b.should.equal(4)
        m.d.should.equal(8) })

      it('- Should return a new map', function() {
        var m = map.map(data, check_call).should.not.equal(data) })

      it('- Should keep only own/enumerable properties', function() {
        var m = map.map(data, function(v, k){ return k == 'c'? v * 2 : v })
        should.not.exist(m.c) })
    })
  })
})

