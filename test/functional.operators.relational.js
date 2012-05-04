describe('{} functional.operators.relational', function() {
  var _ = require('../src/functional/operators/relational')
  var ensure = require('noire').ensure

  describe('λ eq', function() {
    it('Given less than twoarguments, should return true', function() {
      ensure(_.eq()).ok()
      ensure(_.eq(0)).ok()
    })
    it('Given more than one arguent, should do recursive == comparisons', function() {
      ensure(_.eq(1, '1', '1')).same((1 == '1') && ('1' == '1'))
      ensure(_.eq(1, 2, false)).same((1 == 2) && (2 == false))
      ensure(_.eq(1, 1, true)).same((1 == 1) && (1 == true))
    })
  })

  describe('λ same', function() {
    it('Given less than twoarguments, should return true', function() {
      ensure(_.same()).ok()
      ensure(_.same(0)).ok()
    })
    it('Given more than one arguent, should do recursive === comparisons', function() {
      ensure(_.same(1, '1', 1)).same((1 === '1') && ('1' === 1))
      ensure(_.same([], [])).same([] === [])
      ensure(_.same(_, _, _)).same((_ === _) && (_ === _))
    })
  })

  describe('λ gt', function() {
    it('Given less than twoarguments, should return true', function() {
      ensure(_.gt()).ok()
      ensure(_.gt(0)).ok()
    })
    it('Given more than one arguent, should do recursive > comparisons', function() {
      ensure(_.gt(1, 2)).not().ok()
      ensure(_.gt(2, 1, 1)).not().ok()
      ensure(_.gt(3, 2, 1)).ok()
    })
  })

  describe('λ gte', function() {
    it('Given less than twoarguments, should return true', function() {
      ensure(_.gte()).ok()
      ensure(_.gte(0)).ok()
    })
    it('Given more than one arguent, should do recursive ≥ comparisons', function() {
      ensure(_.gte(1, 2)).not().ok()
      ensure(_.gte(2, 1, 1)).ok()
      ensure(_.gte(3, 2, 1)).ok()
    })
  })

  describe('λ lt', function() {
    it('Given less than twoarguments, should return true', function() {
      ensure(_.lt()).ok()
      ensure(_.lt(0)).ok()
    })
    it('Given more than one arguent, should do recursive < comparisons', function() {
      ensure(_.lt(2, 1)).not().ok()
      ensure(_.lt(1, 2, 2)).not().ok()
      ensure(_.lt(1, 2, 3)).ok()
    })
  })

  describe('λ lte', function() {
    it('Given less than twoarguments, should return true', function() {
      ensure(_.lte()).ok()
      ensure(_.lte(0)).ok()
    })
    it('Given more than one arguent, should do recursive < comparisons', function() {
      ensure(_.lte(2, 1)).not().ok()
      ensure(_.lte(1, 2, 2)).ok()
      ensure(_.lte(1, 2, 3)).ok()
    })
  })

})