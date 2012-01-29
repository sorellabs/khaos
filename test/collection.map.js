var map = require('../src/collection/map')
var expect = require('expect.js')

function d(value, enumerable) {
  return { value: value
         , enumerable: enumerable === false? false : true
         , configurable: true
         , writable: true }
}

function count() {
  return function _() {
    return _.num = (_.num || 0) + 1 }}

describe('{} collection.map', function() {
  var foo = {a:1}
  var data, keys, values

  function check_call(value, key) {
    var i = keys.indexOf(key)
    expect(i).to.not.be(-1)
    expect(values[i]).to.be(value)
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
      expect(c.num).to.be(2) })

    it('- Should pass (value, key, map) to the iterator', function() {
      map.each(data, function(v,k,m) {
        expect(m).to.be(data)
        expect(keys).to.contain(k)
        expect(values).to.contain(v) })})
  })

  describe('at', function() {
    it('- Should retrieve the value for the given key', function() {
      expect(map.at(null, 'foo')).to.be(undefined)
      expect(map.at(data, 'a')).to.be(1)
      expect(map.at(data, 'b')).to.be(2)
      expect(map.at(data, 'c')).to.be(3) })
  })

  describe('put', function() {
    it('- Should assign a value to the given key', function() {
      expect(map.put(null, 'a', 1)).to.be(null)
      map.put(data, 'b', 3)
      map.put(data, 'e', 4)
      expect(data.b).to.be(3)
      expect(data.e).to.be(4) })
  })

  describe('remove', function() {
    it('- Should delete the given key from the map', function() {
      expect(map.remove(null, 'a')).to.be(null)
      map.remove(data, 'b')
      expect(map.hasOwnProperty('b')).to.not.be.ok() })
  })

  describe('clear', function() {
    it('- Should remove all enumerable keys from the map', function(){
      expect(map.clear(null)).to.be(null)
      map.clear(data)
      expect(data.a).to.be(1)
      expect(data.hasOwnProperty('b')).to.not.be.ok()
      expect(data.hasOwnProperty('c')).to.be.ok()
      expect(data.hasOwnProperty('d')).to.not.be.ok() })
  })

  describe('size', function() {
    it('- Should return the number of enumerable keys in the map', function() {
      expect(map.size(null)).to.be(0)
      expect(map.size(data)).to.be(2) })
  })

  describe('empty_p', function() {
    it('- Should check if there\'s any enumerable key in the map', function() {
      expect(map.empty_p(null)).to.be.ok()
      expect(map.empty_p({})).to.be.ok()
      expect(map.empty_p(data)).to.not.be.ok()
      delete data.b
      delete data.d
      expect(map.empty_p(data)).to.be.ok() })
  })

  describe('has_key_p', function() {
    it('- Should check if the map has the key', function() {
      expect(map.has_key_p(null, 'a')).to.not.be.ok()
      expect(map.has_key_p(data, 'b')).to.be.ok()
      expect(map.has_key_p(data, 'a')).to.not.be.ok()
      expect(map.has_key_p(data, 'c')).to.be.ok() })
  })

  describe('keys', function() {
    it('- Should return all enumerable keys in the map', function() {
      expect(map.keys(null).length).to.be(0)
      expect(map.keys(data)).to.eql(keys) })
  })

  describe('values', function() {
    it('- Should return all enumerable values in the map', function() {
      expect(map.values(null).length).to.be(0)
      expect(map.values(data)).to.eql(values) })
  })

  describe('items', function() {
    it('- Should return all enumerable key/value pairs in the map', function() {
      expect(map.items(null).length).to.be(0)
      expect(map.items(data)).to.eql([['b',2],['d',4]]) })
  })

  describe('reduce', function() {
    it('- Should apply the function to all key/value pairs in the map', function() {
      map.reduce(data, 0, function(acc, value, key) {
        check_call(value, key) })

      expect(keys).to.eql([])
      expect(values).to.eql([]) })

    it('- Should return the accumulated value', function() {
      expect(map.reduce(data, 0, function(acc, value) {
        return acc + value })).to.be(6) })

    it('- Should use the first key/value pair as initial value if one isnt given', function() {
      map.reduce(data, function(acc, value) {
        expect(values).to.contain(acc) })})
  })

  describe('every', function() {
    it('- Should check if all key/value pairs pass the predicate', function() {
      expect(map.every(data, check_call)).to.be.ok()
      expect(keys).to.eql([])
      expect(values).to.eql([]) })

    it('- Should short-circuit', function() {
      var x = true
      var c = 0
      expect(map.every(data, function(acc, value) {
        c++
        return x = !x })).to.not.be.ok()
      expect(c).to.be(1) })
  })

  describe('some', function() {
    it('- Should check if any key/value pairs pass the predicate', function() {
      expect(map.some(data, function(v,k){ check_call(v, k) })).to.not.be.ok()
      expect(keys).to.eql([])
      expect(values).to.eql([]) })

    it('- Should short-circuit', function() {
      expect(map.some(data, check_call)).to.be.ok()
      expect(keys.length).to.be(1) })
  })

  describe('filter', function() {
    it('- Should keep only key/value pairs that pass the predicate', function() {
      var m = map.filter(data, function(v, k) { return k == 'b' })
      expect(m).to.eql({'b': 2}) })

    it('- Should return a new map', function() {
      expect(map.filter(data, check_call)).to.not.be(data) })

    it('- Should keep only own/enumerable properties', function() {
      var m = map.filter(data, function(v, k) { return k == 'c' })
      expect(m).to.eql({}) })
  })

  describe('map', function() {
    it('- Should transform all enumerable key/value pairs', function() {
      var m = map.map(data, function(v, k) { return v * 2 })
      expect(m.b).to.be(4)
      expect(m.d).to.be(8) })

    it('- Should return a new map', function() {
      var m = expect(map.map(data, check_call)).to.not.be(data) })

    it('- Should keep only own/enumerable properties', function() {
      var m = map.map(data, function(v, k){ return k == 'c'? v * 2 : v })
      expect(m.c).to.be(undefined) })
  })

})

