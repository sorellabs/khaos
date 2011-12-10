var type = require('../src/type')

describe('Module: type', function() {

  describe('is_p :: Any, Object | Fun -> Bool', function() {
    it('- Should check for instanceof relationships when given a Function', function() {
      type.is_p([], Array).should.be.true
      type.is_p([], Object).should.be.true
      type.is_p({}, Array).should.be.false })

    it('- Should check for the object in the [[Prototype]] chain when given an Object', function() {
      type.is_p([], Array.prototype).should.be.true
      type.is_p([], Object.prototype).should.be.true
      type.is_p({}, Array.prototype).should.be.false })
  })

  describe('name :: Any -> String', function() {
    it('- Should return the [[Class]] of the given subject', function() {
      type.name([]).should.equal('Array')
      type.name({}).should.equal('Object')
      type.name(function(){}).should.equal('Function')
      type.name(0).should.equal('Number')
      type.name(NaN).should.equal('Number')
      type.name('').should.equal('String')
      type.name(new Date).should.equal('Date')
      type.name(undefined).should.equal('Undefined')
      type.name(null).should.equal('Null')
      type.name(true).should.equal('Boolean')
      type.name(/re/).should.equal('RegExp')
      type.name(new Boolean(true)).should.equal('Boolean')
      type.name(new String('')).should.equal('String')
      type.name(new Number(0)).should.equal('Number') })
  })

  describe('string_p :: Any -> Bool', function() {
    it('- Should check if the subject is-a plain String', function() {
      type.string_p('').should.be.true
      type.string_p(new String('')).should.be.true
      type.string_p(['']).should.be.false })
  })

  describe('number_p :: Any -> Bool', function() {
    it('- Should check if the subject is-a plain Number', function() {
      type.number_p(0).should.be.true
      type.number_p(NaN).should.be.true
      type.number_p('0').should.be.false })
  })

  describe('date_p :: Any -> Bool', function() {
    it('- Should check if the subject is-a Date', function() {
      type.date_p(new Date).should.be.true
      type.date_p(0).should.be.false })
  })

  describe('regexp_p :: Any -> Bool', function() {
    it('- Should check if the subject is-a Regular Expression', function() {
      type.regexp_p(/re/).should.be.true
      type.regexp_p(new RegExp('re')).should.be.true
      type.regexp_p('re').should.be.false })
  })

  describe('fun_p :: Any -> Bool', function() {
    it('- Should check if the subject is-a Function', function() {
      type.fun_p(function(){}).should.be.true
      type.fun_p(new Function).should.be.true
      type.fun_p(/re/).should.be.false })
  })

  describe('bool_p :: Any -> Bool', function() {
    it('- Should check if the subject is-a Boolean', function() {
      type.bool_p(true).should.be.true
      type.bool_p(false).should.be.true
      type.bool_p(new Boolean(true)).should.be.true
      type.bool_p(0).should.be.false })
  })

  describe('object_p :: Any -> Bool', function() {
    it('- Should check if something is-a Object', function() {
      type.object_p({}).should.be.true
      type.object_p([]).should.be.false
      type.object_p(null).should.be.false })
  })

  describe('primitive_p :: Any -> Bool', function() {
    it('- Should check if something is a primitive', function() {
      type.primitive_p(1).should.be.true
      type.primitive_p('').should.be.true
      type.primitive_p(false).should.be.true
      type.primitive_p(new Number(1)).should.be.false })
  })

  describe('undefined_p :: Any -> Bool', function() {
    it('- Should check if something is undefined', function() {
      type.undefined_p(undefined).should.be.true
      type.undefined_p(null).should.be.false })
  })
})




