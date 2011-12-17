var seq = require('../src/collection/sequence')

describe('Package: collection', function() {
  describe('Module: sequence', function() {

    describe('each', function() {
      it('- Should apply iterator to every item in the sequence')
      it('- Should work for sparse sequences')
    })

    describe('insert', function() {
      it('- Should insert the element at the given index')
    })

    describe('add', function() {
      it('- Should append an element to the sequence')
    })

    describe('replace', function() {
      it('- Should replace the all occurrences of x by y')
    })

    describe('concatenate', function() {
      it('- Should yield a new sequence merging the given two')
    })

    describe('clear', function() {
      it('- Should remove all items from the sequence')
    })

    describe('at', function() {
      it('- Should return the item at the given index')
    })

    describe('put', function() {
      it('- Should replace the item at the given index')
    })

    describe('remove', function() {
      it('- Should remove the item at the given index')
      it('- Should change the sequence size')
    })

    describe('reduce', function() {
      it('- Should apply the function to all key/value pairs in the sequence ltr')
      it('- Should return the accumulated value')
      it('- Should use the first key/value pair as initial if one isnt given')
    })

    describe('reduce_right', function() {
      it('- Should apply the function to all key/value pairs in the sequence rtl')
      it('- Should return the accumulated value')
      it('- Should use the last key/value pair as initial if one isnt given')
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
      it('- Should return a new sequence')
    })
    
    describe('map', function() {
      it('- Should transform all enumerable key/value pairs')
      it('- Should return a new sequence')
    })

    describe('size', function() {
      it('- Should return the highest boundary of the sequence')
    })

    describe('empty_p', function() {
      it('- Should check if sequence has any items')
    })

    describe('has_p', function() {
      it('- Should check if the sequence has the given value')
    })

    describe('first', function() {
      it('- Should return the car of the sequence')
    })

    describe('rest', function() {
      it('- Should return the cdr of the sequence')
    })

    describe('last', function() {
      it('- Should return the last item of the sequence')
    })

    describe('but_last', function() {
      it('- Should return all but the last item of the sequence')
    })

    describe('slice', function() {
      it('- Should return the given part of the sequence')
      it('- Given a start point, should return items from that point onwards')
      it('- Given an ending point, should return items up to that point')
      it('- Should consider negative indexes relative to the end of the sequence')
    })

    describe('take', function() {
      it('- Should take at most N items, starting from the head')
    })

    describe('drop', function() {
      it('- Shoudl discard at most N items, starting from the head')
    })

    describe('split', function() {
      it('- Should return a list of lists, split where the predicate passes')
    })

    describe('sort', function() {
      it('- Should arrange items according to sorting function')
      it('- Given no function, should sort items lexicographically')
    })

    describe('reverse', function() {
      it('- Should reverse the order of the sequence items')
    })

    describe('find_first', function() {
      it('- Should find the first value === V')
      it('- When not found, should return -1')
    })

    describe('find_last', function() {
      it('- Should find the last value === V')
      it('- When not found, should return -1')
    })

  })
})