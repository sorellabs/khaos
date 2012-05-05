describe('{} collection.structs.hashmap', function() {
  var Hashmap = require('../src/collection/structs/hashmap')
  var ensure = require('noire').ensure
  var sinon = require('sinon')
  var keys = Object.keys

  var a, b, c = {}
  beforeEach(function() {
    a = Hashmap.make()
    a.put('foo', 1); a.put('bar', c)

    b = Hashmap.make()
    b._key_prefix = ':'
    b.put('foo', 2); b.put('baz', []); b.put('lol', true)
  })

  function number_p(x){ return typeof x == 'number' }

  describe('λ init', function() {
    it('Should initialise an object with the basic Hashmap interface.', function() {
      var x = Hashmap.make()
      ensure(x).property('_key_prefix')
      ensure(x._key_prefix).type('String')

      ensure(x).property('_dictionary')
      ensure(x._dictionary).type('Object')
    })
    it('Should update the Hashmap if a dictionary is given.', function() {
      var x = Hashmap.make({ foo: 1, bar: 2 })
      ensure(x).invoke('at', 'foo').same(1)
      ensure(x).invoke('at', 'bar').same(2)

      var x = Hashmap.make(a)
      ensure(x).invoke('at', 'foo').same(1)
      ensure(x).invoke('at', 'bar').same(c)
    })
  })

  describe('λ each', function() {
    it('Should applly iterator to every key.', function() {
      var f = sinon.stub()
      a.each(f)
      ensure(f).property('callCount', 2)

      var f = sinon.stub()
      b.each(f)
      ensure(f).property('callCount', 3)
    })
    it('Should pass (value, key, hashmap) to the iterator.', function() {
      var f = sinon.stub()
      a.each(f)
      ensure(f).invoke('calledWithExactly', 1, 'foo', a).ok()
      ensure(f).invoke('calledWithExactly', c, 'bar', a).ok()
    })
  })

  describe('λ put', function() {
    it('Should assign a value to the given key.', function() {
      ensure(a).invoke('at', 'lol').same(undefined)
      a.put('lol', 1)
      ensure(a).invoke('at', 'lol').same(1)
    })
    it('Should avoid problems with magical properties.', function() {
      if (!('__proto__' in {})) return console.log('__proto__ magic not supported')

      a.put('__proto__', {})
      ensure(a._dictionary).property('__proto__', Object.prototype)
    })
  })

  describe('λ remove', function() {
    it('Should remove the given key and its associated value.', function() {
      a.remove('foo')
      ensure(a).invoke('at', 'foo').same(undefined)
    })
  })

  describe('λ replace', function() {
    it('Should replace all values that match by the given replacement.', function() {
      var x = Hashmap.make({ a: 1, b: 2, c: 1, d: [1] })
      x.replace(1, 0)
      ensure(x).invoke('at', 'a').same(0)
      ensure(x).invoke('at', 'b').same(2)
      ensure(x).invoke('at', 'c').same(0)
      ensure(x).invoke('at', 'd').equals([1])
    })
  })

  describe('λ update', function() {
    it('Given a Traversable, should import all key/value pairs from it.', function() {
      var x = Hashmap.make(a)
      ensure(x).invoke('at', 'foo').same(1)
      ensure(x).invoke('at', 'bar').same(c)

      var x = Hashmap.make({ each: function(c){ c(1, 'a'); c(2, 'b') }})
      ensure(x).invoke('at', 'a').same(1)
      ensure(x).invoke('at', 'b').same(2)
    })
    it('Given a map, should import all own enumerable properties from it.', function() {
      var x = Hashmap.make({ a: 1, b: 2, c: 3 })
      ensure(x).invoke('at', 'a').same(1)
      ensure(x).invoke('at', 'b').same(2)
      ensure(x).invoke('at', 'c').same(3)
    })
  })

  describe('λ clear', function() {
    it('Should remove all key/value pairs.', function() {
      a.clear()
      ensure(Object.keys(a._dictionary)).empty()
    })
  })

  describe('λ size', function() {
    it('Should return the number of key/value pairs.', function() {
      ensure(a).invoke('size').same(2)
      ensure(b).invoke('size').same(3)
    })
  })

  describe('λ at', function() {
    it('Should retrieve the value for the given key.', function() {
      ensure(a).invoke('at', 'foo').same(1)
      ensure(a).invoke('at', 'bar').same(c)
      ensure(b).invoke('at', 'foo').same(2)
      ensure(b).invoke('at', 'baz').equals([])
      ensure(b).invoke('at', 'lol').same(true)
    })
    it('Should return the default value if key is absent.', function() {
      ensure(a).invoke('at', 'a').same(undefined)
      ensure(a).invoke('at', 'a', 1).same(1)
    })
  })

  describe('λ empty_p', function() {
    it('Should check if there\'s no key/value pair.', function() {
      ensure(Hashmap.make()).invoke('empty_p').ok()
      ensure(a).invoke('empty_p').not().ok()
    })
  })

  describe('λ has_key_p', function() {
    it('Should check if the given key exists.', function() {
      ensure(a).invoke('has_key_p', 'foo').ok()
      ensure(a).invoke('has_key_p', 'a').not().ok()
    })
  })

  describe('λ keys', function() {
    it('Should return a list of all keys without prefix.', function() {
      ensure(a.keys().sort()).equals(['bar', 'foo'])
      ensure(b.keys().sort()).equals(['baz', 'foo', 'lol'])
    })
  })

  describe('λ values', function() {
    it('Should return a list of all values.', function() {
      ensure(a.values()).contains(1)
      ensure(a.values()).contains(c)
      ensure(a.values()).property('length', 2)
    })
  })

  describe('λ items', function() {
    it('Should return a list of (key, value) tuples.', function() {
      var items = a.items().sort(function(a,b){ return b[0] < a[0] })
      ensure(items).equals([['bar', c], ['foo', 1]])
    })
  })

  describe('λ reduce', function() {
    it('Should apply the function to all key/value pairs.', function() {
      var f = sinon.stub().returns(0)
      a.reduce(0, f)
      ensure(f).invoke('calledWithExactly', 0, 1, 'foo', a).ok()
      ensure(f).invoke('calledWithExactly', 0, c, 'bar', a).ok()
    })
    it('Should return the accumulated value.', function() {
      var x = Hashmap.make({ a: 1, b: 2, c: 3 })
      ensure(x.reduce(0, function(a, b){ return a + b })).same(6)
    })
    it('Should use the first key/value pair\'s value as initial value if one isn\'t given.', function() {
      var x = Hashmap.make({ a: 1 }).reduce(sinon.stub().returnsArg(0))
      ensure(x).same(1)
    })
  })

  describe('λ every', function() {
    it('Should check if all key/value pairs pass the predicate.', function() {
      var x = Hashmap.make({ a: 1, b: 2, c: 3 })
      ensure(x.every(number_p)).ok()
    })
    it('Should short-circuit as soon as the predicate fails.', function() {
      var x = Hashmap.make({ a: 1, b: '2', c: 3 })
      var f = sinon.stub().returns(true).withArgs('2').returns(false)
      x.every(f)
      ensure(f).property('callCount', keys(x._dictionary).indexOf('@b'))
    })
  })

  describe('λ some', function() {
    it('Should check if any key/value pair pass the predicate.', function() {
      var x = Hashmap.make({ a: 1, b: '2', c: 3 })
      ensure(x.some(number_p)).ok()
    })
    it('Should short-circuit as soon as the predicate passes.', function() {
      var x = Hashmap.make({ a: '1', b: 2, c: 3 })
      var f = sinon.stub().returns(false).withArgs(2).returns(true)
      x.some(f)
      ensure(f).property('callCount', keys(x._dictionary).indexOf('@b'))
    })
  })

  describe('λ filter', function() {
    it('Should keep only key/value pairs that pass the predicate.', function() {
      var x = Hashmap.make({ a: 1, b: '2', c: 3 })
      ensure(x.filter(number_p).keys().sort()).equals(['a', 'c'])
    })
    it('Should return a new Hashmap.', function() {
      var x = Hashmap.make({ a: 1, b: '2', c: 3 })
      ensure(x.filter(number_p)).not().same(x)
    })
  })

  describe('λ map', function() {
    it('Should transform all key/value pairs by the mapping function.', function() {
      var x = Hashmap.make({ a: 1, b: 2, c: 3 })
      function Double(x){ return x * x }
      ensure(x.map(Double).values().sort()).equals([1, 4, 9])
    })
    it('Should return a new Hashmap.', function() {
      var x = Hashmap.make({ a: 1, b: 2, c: 3 })
      ensure(x.map(number_p)).not().same(x)
    })
  })
})